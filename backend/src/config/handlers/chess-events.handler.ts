import { Server, Socket } from "socket.io";
import { RoomManager } from "@/utils/room-manager"; // Adjust if needed
import { Chess } from "chess.js";
import logger from "@/utils/logger";

// We use this Map ONLY to store the heavy chess.js engine instances!
const chessGames = new Map<
  string,
  {
    engine: Chess;
    whiteId: string;
    blackId: string | null;
    timeControl: number;
    status: "waiting" | "playing" | "finished";
  }
>();

export function registerChessEvents(
  io: Server,
  socket: Socket,
  roomManager: RoomManager,
) {
  // 1. GET ROOMS (Lobby)
  socket.on("chess:getRooms", () => {
    // We filter the global room manager for ONLY chess rooms that are waiting
    const availableRooms = roomManager
      .listRooms()
      .filter(
        (r) =>
          r.gameType === "chess" &&
          (!chessGames.has(r.id) || chessGames.get(r.id)?.status === "waiting"),
      )
      .map((r) => ({
        id: r.id,
        name: r.name,
        players: r.playerCount,
        maxPlayers: 2,
        timeControl: chessGames.get(r.id)?.timeControl || 600,
        status: "waiting",
      }));

    socket.emit("chess:roomList", availableRooms);
  });

  // 2. CREATE ROOM
  socket.on("chess:createRoom", ({ timeControl, roomName }) => {
    console.log("2. SERVER RECEIVED CREATE ROOM EVENT!", {
      timeControl,
      roomName,
    });
    // 💥 USING YOUR TEAM'S ROOM MANAGER! 💥
    const room = roomManager.createRoom(
      socket.id,
      roomName || "Chess Match",
      "chess",
    );
    const roomId = room.id;

    // Spin up the chess engine for this specific room
    chessGames.set(roomId, {
      engine: new Chess(),
      whiteId: socket.id,
      blackId: null,
      timeControl: timeControl || 600,
      status: "waiting",
    });

    socket.join(`chess:${roomId}`);

    socket.emit("chess:roomCreated", {
      room: { id: roomId, timeControl },
    });

    // Broadcast updated list to lobby
    const availableRooms = roomManager
      .listRooms()
      .filter(
        (r) =>
          r.gameType === "chess" && chessGames.get(r.id)?.status === "waiting",
      );
    io.emit(
      "chess:roomList",
      availableRooms.map((r) => ({
        id: r.id,
        name: r.name,
        players: r.playerCount,
        maxPlayers: 2,
        timeControl: chessGames.get(r.id)?.timeControl || 600,
        status: "waiting",
      })),
    );

    logger.info(`User ${socket.id} created Chess Room: ${roomId}`);
  });

  // 3. JOIN ROOM
  socket.on("chess:joinRoom", ({ roomId }) => {
    const game = chessGames.get(roomId);

    if (!game || game.status !== "waiting") {
      return socket.emit("chess:error", { message: "Room not found or full" });
    }

    // 💥 USING YOUR TEAM'S ROOM MANAGER! 💥
    roomManager.joinRoom(roomId, socket.id);

    game.blackId = socket.id;
    game.status = "playing";
    socket.join(`chess:${roomId}`);

    socket.emit("chess:roomJoined", { room: { id: roomId } });

    // 🚀 START THE GAME FOR BOTH PLAYERS 🚀
    io.to(`chess:${roomId}`).emit("chess:gameStart", {
      whiteId: game.whiteId,
      blackId: game.blackId,
      fen: game.engine.fen(),
      timeControl: game.timeControl,
    });

    // Update lobby to hide full room
    const availableRooms = roomManager
      .listRooms()
      .filter(
        (r) =>
          r.gameType === "chess" && chessGames.get(r.id)?.status === "waiting",
      );
    io.emit(
      "chess:roomList",
      availableRooms.map((r) => ({
        id: r.id,
        name: r.name,
        players: r.playerCount,
        maxPlayers: 2,
        timeControl: chessGames.get(r.id)?.timeControl || 600,
        status: "waiting",
      })),
    );

    logger.info(`User ${socket.id} joined Chess Room: ${roomId}`);
  });

  // 4. MAKE MOVE
  socket.on("chess:move", ({ roomId, from, to, promotion }) => {
    const game = chessGames.get(roomId);
    if (!game) return;

    try {
      const move = game.engine.move({ from, to, promotion });
      if (!move)
        return socket.emit("chess:invalidMove", { message: "Illegal move" });

      let gameStatus = "playing";
      if (game.engine.isCheckmate()) gameStatus = "checkmate";
      else if (game.engine.isDraw() || game.engine.isStalemate())
        gameStatus = "draw";

      io.to(`chess:${roomId}`).emit("chess:moveMade", {
        fen: game.engine.fen(),
        san: move.san,
        color: move.color,
        status: gameStatus,
        clocks: { w: game.timeControl, b: game.timeControl },
      });
    } catch (err) {
      socket.emit("chess:invalidMove", { message: "Illegal move" });
    }
  });

  // 5. RESIGN
  socket.on("chess:resign", ({ roomId }) => {
    io.to(`chess:${roomId}`).emit("chess:gameOver", { status: "resigned" });
    chessGames.delete(roomId);
    // Cleanup global room
    roomManager.leaveRoom(roomId, socket.id);
  });

  // 6. OFFER DRAW
  socket.on("chess:offerDraw", ({ roomId }) => {
    socket
      .to(`chess:${roomId}`)
      .emit("chess:drawOffered", { offeredBy: socket.id });
  });

  socket.on("chess:respondDraw", ({ roomId, accept }) => {
    io.to(`chess:${roomId}`).emit("chess:drawResponse", { accepted: accept });
    if (accept) {
      chessGames.delete(roomId);
      roomManager.leaveRoom(roomId, socket.id);
    }
  });
}
