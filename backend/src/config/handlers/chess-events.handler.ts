// config/handlers/chess-events.handler.ts
// Handles all chess:* socket events for multiplayer chess.

import { Server, Socket } from "socket.io";
import { RoomManager } from "@/utils/room-manager";
import { ChessRoomManager } from "@/utils/chess-room-manager";
import logger from "@/utils/logger";
import type { Color, ChessRoomInfo } from "@/types/chess.types";

// Singleton chess room manager — shared across all connections
const chessRoomManager = new ChessRoomManager();

// Track readiness per room (before game state exists)
const readyPlayers = new Map<string, Set<string>>();

// Track disconnected players for reconnection grace period
const disconnectTimers = new Map<string, ReturnType<typeof setTimeout>>();
const DISCONNECT_TIMEOUT_SECONDS = 30;

export function registerChessEvents(
  io: Server,
  socket: Socket,
  roomManager: RoomManager,
  userSocketMap: Map<string, string>,
) {
  // ── chess:createRoom ──
  socket.on(
    "chess:createRoom",
    (data: { timeControl: number; roomName?: string }) => {
      try {
        const timeControl = data.timeControl || 600;
        const room = roomManager.createRoom(
          socket.id,
          data.roomName || `Chess Room`,
          "chess",
        );
        socket.join(room.id);

        const roomInfo: ChessRoomInfo = {
          id: room.id,
          name: room.name,
          playerCount: room.players.size,
          players: Array.from(room.players),
          timeControl,
          status: "waiting",
        };

        // Store timeControl on the room's gameState so we can read it later
        roomManager.setGameState(room.id, { timeControl });

        socket.emit("chess:roomCreated", { success: true, room: roomInfo });
        logger.info(
          `[Chess] Room ${room.id} created by ${socket.id}, timeControl=${timeControl}s`,
        );

        // Broadcast updated chess room list
        broadcastChessRooms(io, roomManager);
      } catch (err) {
        logger.error("[Chess] Error creating room", { error: err });
        socket.emit("chess:error", { message: "Failed to create room" });
      }
    },
  );

  // ── chess:getRooms ──
  socket.on("chess:getRooms", () => {
    const rooms = getChessRooms(roomManager);
    socket.emit("chess:roomList", rooms);
  });

  // ── chess:joinRoom ──
  socket.on("chess:joinRoom", (data: { roomId: string }) => {
    try {
      const room = roomManager.getRoom(data.roomId);
      if (!room) {
        socket.emit("chess:error", { message: "Room not found" });
        return;
      }

      if (room.players.size >= 2) {
        socket.emit("chess:error", { message: "Room is full" });
        return;
      }

      const success = roomManager.joinRoom(data.roomId, socket.id);
      if (!success) {
        socket.emit("chess:error", { message: "Failed to join room" });
        return;
      }

      socket.join(data.roomId);

      const gameState = room.gameState || {};
      const roomInfo: ChessRoomInfo = {
        id: room.id,
        name: room.name,
        playerCount: room.players.size,
        players: Array.from(room.players),
        timeControl: gameState.timeControl || 600,
        status: "waiting",
      };

      socket.emit("chess:roomJoined", { success: true, room: roomInfo });

      // Notify the other player
      socket.to(data.roomId).emit("chess:playerJoined", {
        playerId: socket.id,
        room: roomInfo,
      });

      logger.info(
        `[Chess] ${socket.id} joined room ${data.roomId}`,
      );

      broadcastChessRooms(io, roomManager);
    } catch (err) {
      logger.error("[Chess] Error joining room", { error: err });
      socket.emit("chess:error", { message: "Failed to join room" });
    }
  });

  // ── chess:leaveRoom ──
  socket.on("chess:leaveRoom", (data: { roomId: string }) => {
    try {
      handleLeaveRoom(io, socket, roomManager, data.roomId);
    } catch (err) {
      logger.error("[Chess] Error leaving room", { error: err });
      socket.emit("chess:error", { message: "Failed to leave room" });
    }
  });

  // ── chess:ready ──
  socket.on("chess:ready", (data: { roomId: string }) => {
    try {
      const room = roomManager.getRoom(data.roomId);
      if (!room) {
        socket.emit("chess:error", { message: "Room not found" });
        return;
      }

      if (!room.players.has(socket.id)) {
        socket.emit("chess:error", { message: "You are not in this room" });
        return;
      }

      // Track readiness
      if (!readyPlayers.has(data.roomId)) {
        readyPlayers.set(data.roomId, new Set());
      }
      readyPlayers.get(data.roomId)!.add(socket.id);

      logger.info(
        `[Chess] ${socket.id} is ready in room ${data.roomId} (${readyPlayers.get(data.roomId)!.size}/${room.players.size})`,
      );

      // Check if both players are ready
      if (
        readyPlayers.get(data.roomId)!.size >= 2 &&
        room.players.size >= 2
      ) {
        const players = Array.from(room.players);
        const gameState = room.gameState || {};
        const timeControl = gameState.timeControl || 600;

        // Randomly assign colors
        const isFirstWhite = Math.random() < 0.5;
        const whiteId = isFirstWhite ? players[0] : players[1];
        const blackId = isFirstWhite ? players[1] : players[0];

        // Create game state
        const game = chessRoomManager.createGame(
          data.roomId,
          whiteId,
          blackId,
          timeControl,
        );

        // Set timeout for white's first move
        setupMoveTimeout(io, data.roomId, chessRoomManager);

        // Emit gameStart to both players
        io.to(data.roomId).emit("chess:gameStart", {
          roomId: data.roomId,
          whiteId,
          blackId,
          fen: game.fen,
          timeControl,
        });

        logger.info(
          `[Chess] Game started in room ${data.roomId}: white=${whiteId}, black=${blackId}`,
        );

        // Clean up readiness tracking
        readyPlayers.delete(data.roomId);
        broadcastChessRooms(io, roomManager);
      }
    } catch (err) {
      logger.error("[Chess] Error handling ready", { error: err });
      socket.emit("chess:error", { message: "Failed to ready up" });
    }
  });

  // ── chess:move ──
  socket.on(
    "chess:move",
    (data: {
      roomId: string;
      from: string;
      to: string;
      promotion?: string;
    }) => {
      try {
        const result = chessRoomManager.makeMove(
          data.roomId,
          socket.id,
          data.from,
          data.to,
          data.promotion,
        );

        if (!result.success) {
          // Check if it's a timeout-induced game over
          if (result.error === "Time expired" && result.game) {
            io.to(data.roomId).emit("chess:gameOver", {
              status: result.game.status,
              winner: result.game.winner,
              reason: "timeout",
            });
            return;
          }

          socket.emit("chess:invalidMove", {
            message: result.error || "Invalid move",
          });
          return;
        }

        const game = result.game!;

        // Calculate authoritative clocks
        const clocks = chessRoomManager.calculateClocks(game);

        // Broadcast the move to both players
        io.to(data.roomId).emit("chess:moveMade", {
          fen: game.fen,
          san: result.san,
          color: game.activeColor === "w" ? "b" : "w", // The color that just moved
          from: data.from,
          to: data.to,
          promotion: data.promotion || null,
          status: game.status,
          clocks,
        });

        // Check for game-ending status
        if (
          game.status === "checkmate" ||
          game.status === "stalemate" ||
          game.status === "draw"
        ) {
          io.to(data.roomId).emit("chess:gameOver", {
            status: game.status,
            winner: game.winner,
            reason: game.status,
          });
          return;
        }

        // Reset timeout for next player
        setupMoveTimeout(io, data.roomId, chessRoomManager);

        logger.info(
          `[Chess] Move in room ${data.roomId}: ${data.from}→${data.to} (${result.san})`,
        );
      } catch (err) {
        logger.error("[Chess] Error processing move", { error: err });
        socket.emit("chess:error", { message: "Failed to process move" });
      }
    },
  );

  // ── chess:offerDraw ──
  socket.on("chess:offerDraw", (data: { roomId: string }) => {
    try {
      const game = chessRoomManager.getGame(data.roomId);
      if (!game) {
        socket.emit("chess:error", { message: "Game not found" });
        return;
      }

      game.drawOfferedBy = socket.id;
      socket.to(data.roomId).emit("chess:drawOffered", {
        offeredBy: socket.id,
      });

      logger.info(`[Chess] Draw offered by ${socket.id} in room ${data.roomId}`);
    } catch (err) {
      logger.error("[Chess] Error offering draw", { error: err });
      socket.emit("chess:error", { message: "Failed to offer draw" });
    }
  });

  // ── chess:respondDraw ──
  socket.on(
    "chess:respondDraw",
    (data: { roomId: string; accept: boolean }) => {
      try {
        const game = chessRoomManager.getGame(data.roomId);
        if (!game) {
          socket.emit("chess:error", { message: "Game not found" });
          return;
        }

        if (data.accept) {
          chessRoomManager.endGame(data.roomId, "draw", null);
          io.to(data.roomId).emit("chess:drawResponse", { accepted: true });
          io.to(data.roomId).emit("chess:gameOver", {
            status: "draw",
            winner: null,
            reason: "draw agreement",
          });
        } else {
          game.drawOfferedBy = null;
          io.to(data.roomId).emit("chess:drawResponse", { accepted: false });
        }

        logger.info(
          `[Chess] Draw ${data.accept ? "accepted" : "declined"} in room ${data.roomId}`,
        );
      } catch (err) {
        logger.error("[Chess] Error responding to draw", { error: err });
        socket.emit("chess:error", { message: "Failed to respond to draw" });
      }
    },
  );

  // ── chess:resign ──
  socket.on("chess:resign", (data: { roomId: string }) => {
    try {
      const game = chessRoomManager.getGame(data.roomId);
      if (!game) {
        socket.emit("chess:error", { message: "Game not found" });
        return;
      }

      const winner: Color =
        socket.id === game.whiteId ? "b" : "w";
      chessRoomManager.endGame(data.roomId, "resigned", winner);

      io.to(data.roomId).emit("chess:gameOver", {
        status: "resigned",
        winner,
        reason: "resignation",
      });

      logger.info(
        `[Chess] ${socket.id} resigned in room ${data.roomId}, winner=${winner}`,
      );
    } catch (err) {
      logger.error("[Chess] Error processing resignation", { error: err });
      socket.emit("chess:error", { message: "Failed to resign" });
    }
  });

  // ── chess:requestRematch ──
  socket.on("chess:requestRematch", (data: { roomId: string }) => {
    try {
      socket.to(data.roomId).emit("chess:rematchRequested", {
        requestedBy: socket.id,
      });
      logger.info(
        `[Chess] Rematch requested by ${socket.id} in room ${data.roomId}`,
      );
    } catch (err) {
      logger.error("[Chess] Error requesting rematch", { error: err });
      socket.emit("chess:error", { message: "Failed to request rematch" });
    }
  });

  // ── chess:respondRematch ──
  socket.on(
    "chess:respondRematch",
    (data: { roomId: string; accept: boolean }) => {
      try {
        if (data.accept) {
          const game = chessRoomManager.getGame(data.roomId);
          if (!game) {
            socket.emit("chess:error", { message: "Game not found" });
            return;
          }

          const room = roomManager.getRoom(data.roomId);
          const gameState = room?.gameState || {};
          const timeControl = gameState.timeControl || 600;

          // Swap colors for the rematch
          const newWhiteId = game.blackId;
          const newBlackId = game.whiteId;

          // Remove old game and create new one
          chessRoomManager.removeGame(data.roomId);
          const newGame = chessRoomManager.createGame(
            data.roomId,
            newWhiteId,
            newBlackId,
            timeControl,
          );

          setupMoveTimeout(io, data.roomId, chessRoomManager);

          io.to(data.roomId).emit("chess:rematchResponse", { accepted: true });
          io.to(data.roomId).emit("chess:gameStart", {
            roomId: data.roomId,
            whiteId: newWhiteId,
            blackId: newBlackId,
            fen: newGame.fen,
            timeControl,
          });

          logger.info(`[Chess] Rematch started in room ${data.roomId}`);
        } else {
          io.to(data.roomId).emit("chess:rematchResponse", { accepted: false });
        }
      } catch (err) {
        logger.error("[Chess] Error responding to rematch", { error: err });
        socket.emit("chess:error", { message: "Failed to respond to rematch" });
      }
    },
  );

  // ── chess:clockSync ──
  socket.on("chess:clockSync", (data: { roomId: string }) => {
    try {
      const game = chessRoomManager.getGame(data.roomId);
      if (!game) return;

      const clocks = chessRoomManager.calculateClocks(game);
      socket.emit("chess:clockUpdate", {
        clocks,
        activeColor: game.activeColor,
      });
    } catch (err) {
      logger.error("[Chess] Error syncing clocks", { error: err });
    }
  });

  // ── Handle disconnection for chess games ──
  socket.on("disconnect", () => {
    const game = chessRoomManager.findGameByPlayer(socket.id);
    if (!game) return;

    // Only notify disconnection if game is in progress
    if (
      game.status !== "playing" &&
      game.status !== "check"
    ) {
      return;
    }

    // Notify opponent
    socket.to(game.roomId).emit("chess:opponentDisconnected", {
      playerId: socket.id,
      timeoutSeconds: DISCONNECT_TIMEOUT_SECONDS,
    });

    // Start a forfeit timer
    const timer = setTimeout(() => {
      const currentGame = chessRoomManager.getGame(game.roomId);
      if (
        currentGame &&
        (currentGame.status === "playing" || currentGame.status === "check")
      ) {
        const winner: Color =
          socket.id === currentGame.whiteId ? "b" : "w";
        chessRoomManager.endGame(game.roomId, "resigned", winner);

        io.to(game.roomId).emit("chess:gameOver", {
          status: "resigned",
          winner,
          reason: "opponent disconnected",
        });

        logger.info(
          `[Chess] ${socket.id} auto-forfeited in room ${game.roomId} due to disconnect`,
        );
      }

      disconnectTimers.delete(socket.id);
    }, DISCONNECT_TIMEOUT_SECONDS * 1000);

    disconnectTimers.set(socket.id, timer);

    logger.info(
      `[Chess] ${socket.id} disconnected from game in room ${game.roomId}. ${DISCONNECT_TIMEOUT_SECONDS}s before forfeit.`,
    );
  });
}

// ── Helper Functions ──

function getChessRooms(roomManager: RoomManager): ChessRoomInfo[] {
  const allRooms = roomManager.listRooms();
  return allRooms
    .filter((r) => r.gameType === "chess")
    .map((r) => {
      const game = chessRoomManager.getGame(r.id);
      const room = roomManager.getRoom(r.id);
      const gameState = room?.gameState || {};

      let status: ChessRoomInfo["status"] = "waiting";
      if (game) {
        if (
          game.status === "playing" ||
          game.status === "check"
        ) {
          status = "in_progress";
        } else if (
          game.status === "checkmate" ||
          game.status === "stalemate" ||
          game.status === "draw" ||
          game.status === "resigned"
        ) {
          status = "finished";
        }
      }

      return {
        id: r.id,
        name: r.name,
        playerCount: r.playerCount,
        players: r.players,
        timeControl: gameState.timeControl || 600,
        status,
      };
    });
}

function broadcastChessRooms(io: Server, roomManager: RoomManager) {
  const rooms = getChessRooms(roomManager);
  io.emit("chess:roomList", rooms);
}

function handleLeaveRoom(
  io: Server,
  socket: Socket,
  roomManager: RoomManager,
  roomId: string,
) {
  roomManager.leaveRoom(roomId, socket.id);
  socket.leave(roomId);

  // Clean up readiness
  readyPlayers.get(roomId)?.delete(socket.id);

  // Notify others
  socket.to(roomId).emit("chess:playerLeft", {
    playerId: socket.id,
    room: roomManager.getRoomInfo(roomId),
  });

  broadcastChessRooms(io, roomManager);

  logger.info(`[Chess] ${socket.id} left room ${roomId}`);
}

function setupMoveTimeout(
  io: Server,
  roomId: string,
  manager: ChessRoomManager,
) {
  const game = manager.getGame(roomId);
  if (!game) return;

  const remainingMs = game.clocks[game.activeColor] * 1000;

  const handle = setTimeout(() => {
    const currentGame = manager.getGame(roomId);
    if (
      currentGame &&
      (currentGame.status === "playing" || currentGame.status === "check")
    ) {
      const winner: Color =
        currentGame.activeColor === "w" ? "b" : "w";
      manager.endGame(roomId, "checkmate", winner);

      io.to(roomId).emit("chess:gameOver", {
        status: "checkmate",
        winner,
        reason: "timeout",
      });

      logger.info(
        `[Chess] ${currentGame.activeColor} ran out of time in room ${roomId}`,
      );
    }
  }, remainingMs);

  manager.setTimeoutHandle(roomId, handle);
}

export { chessRoomManager };
