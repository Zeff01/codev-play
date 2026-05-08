
import { Server, Socket } from "socket.io";
import { RoomManager } from "@/utils/room-manager";
import { TicTacToeService } from "@/services/tictactoe/tictactoe.service";
import { ticTacToeModel } from "@/models/tictactoe.model";
import logger from "@/utils/logger";
import { ChessService } from "@/services/chess/chess.services";
import { ChessModel } from "@/models/chess.model";
import { ChessSocket } from "@/sockets/chess.socket";
import { GameDisconnectHandler } from "@/services/chess/chess.disconnecthandler";

const tttService = new TicTacToeService(new ticTacToeModel());
const chessService = new ChessService(new ChessSocket(), new ChessModel());

// Game service registry for different game types
const gameServices = {
  tictactoe: tttService,
  chess: chessService,
  // Add other game services here as they're implemented
  // snake: snakeService,
  // rps: rpsService,
};

export function registerGameEvents(
  io: Server,
  socket: Socket,
  roomManager: RoomManager,
  userSocketMap: Map<string, string>,
) {
  socket.on("game:join", (data: { gameId: string; gameType?: string }) => {
    try {
      const playerRoom = roomManager.getPlayerRoom(socket.id);
      if (!playerRoom) {
        socket.emit("game:error", { message: "You must be in a room to join a game" });
        return;
      }

      // Set the gameId for the room
      roomManager.setGameId(playerRoom.id, data.gameId);

      // Join game-specific socket room
      socket.join(`game:${data.gameId}`);

      socket.emit("game:joined", {
        success: true,
        gameId: data.gameId,
        roomId: playerRoom.id,
        gameType: data.gameType || playerRoom.gameType,
      });

      logger.info(`User ${socket.id} joined game ${data.gameId} in room ${playerRoom.id}`);
    } catch (err) {
      logger.error("Error joining game", { error: err });
      socket.emit("game:error", { message: "Failed to join game" });
    }
  });

  socket.on("game:move", async (data: { gameId: string; gameType?: string; moveData: any }) => {
        console.log("backend game:move received from", socket.id, "gameId:", data.gameId);

    try {
      const playerRoom = roomManager.getPlayerRoom(socket.id);
      if (!playerRoom) {
        socket.emit("game:error", { message: "You must be in a room to make a move" });
        return;
      }

      // Get user ID from socket map
      let userId = null;
      for (const [uid, sid] of userSocketMap.entries()) {
        if (sid === socket.id) {
          userId = uid;
          break;
        }
      }

      if (!userId) {
        socket.emit("game:error", { message: "User not authenticated" });
        return;
      }

      // Determine game type and get appropriate service
      const gameType = data.gameType || playerRoom.gameType || "tictactoe";
      const gameService = gameServices[gameType as keyof typeof gameServices];

      if (!gameService) {
        socket.emit("game:error", { message: `Unsupported game type: ${gameType}` });
        return;
      }

      let game;

      // Handle different game types based on move data structure
      switch (gameType) {
        case "tictactoe":
          // Tic-Tac-Toe move: { row, col }
          if (!data.moveData?.row !== undefined || !data.moveData?.col !== undefined) {
            socket.emit("game:error", { message: "Invalid move data for Tic-Tac-Toe" });
            return;
          }
          game = await (gameService as TicTacToeService).playMove(
            data.gameId,
            parseInt(userId),
            data.moveData.row,
            data.moveData.col,
          );
          break;

        case "chess":
          // Chess move: { from, to, promotion }
          if (!data.moveData?.from || !data.moveData?.to) {
            socket.emit("game:error", { message: "Invalid move data for Chess" });
            return;
          }

          game = await (gameService as any).playMove(
            data.gameId,
            parseInt(userId),
            data.moveData.from,
            data.moveData.to,
            data.moveData.promotion
          );
          break;

        // Add other game types here
        // case 'snake':
        //   game = await (gameService as SnakeService).handleMove(data.gameId, parseInt(userId), data.moveData);
        //   break;

        default:
          socket.emit("game:error", { message: `Game type ${gameType} not implemented` });
          return;
      }

      // Update room game state
      roomManager.setGameState(playerRoom.id, game);

      // Broadcast move to all players in game room
      socket.to(`game:${data.gameId}`).emit("game:move", {
        gameId: data.gameId,
        gameType,
        moveData: data.moveData,
        game: game,
        playerId: socket.id,
      });

      logger.info(`User ${socket.id} made move in game ${data.gameId} (${gameType})`);
    } catch (err) {
      logger.error("Error making move", { error: err });
      console.error("Full move error:", err);
      socket.emit("game:error", { message: "Failed to make move" });
    }
  });

  socket.on("game:reset", async (data: { gameId: string; gameType?: string }) => {
    try {
      const playerRoom = roomManager.getPlayerRoom(socket.id);
      if (!playerRoom) {
        socket.emit("game:error", { message: "You must be in a room to reset a game" });
        return;
      }

      const gameType = data.gameType || playerRoom.gameType || "tictactoe";
      const gameService = gameServices[gameType as keyof typeof gameServices];

      if (!gameService) {
        socket.emit("game:error", { message: `Unsupported game type: ${gameType}` });
        return;
      }

      const game = await gameService.resetExistingGame(data.gameId);

      // Update room game state
      roomManager.setGameState(playerRoom.id, game);

      // Broadcast reset to all players in game room
      io.to(`game:${data.gameId}`).emit("game:reset", {
        gameId: data.gameId,
        gameType,
        game: game,
      });

      logger.info(`User ${socket.id} reset game ${data.gameId} (${gameType})`);
    } catch (err) {
      logger.error("Error resetting game", { error: err });
      socket.emit("game:error", { message: "Failed to reset game" });
    }
  });
  
  socket.on("game:reconnect", async (data: { gameId: string; gameType?: string }) => {
  try {
    // Find the userId from socket map
    let userId = null;
    for (const [uid, sid] of userSocketMap.entries()) {
      if (sid === socket.id) {
        userId = uid;
        break;
      }
    }

    if (!userId) {
      socket.emit("game:error", { message: "User not authenticated" });
      return;
    }
    const rawUserId = parseInt(userId, 10);

    // Cancel disconnect timer for chess
    if (data.gameType === "chess") {
      const gameDisconnect = new GameDisconnectHandler(
        io,
        chessService, 
        new ChessModel(),
        new ChessSocket()
      );
      gameDisconnect.handleReconnect(data.gameId, rawUserId);
    }
    // For other games, add similar clear logic

    // Rejoin the game socket room
    socket.join(`game:${data.gameId}`);

    // Fetch latest game state
    const gameService = gameServices[data.gameType as keyof typeof gameServices];
    const game = await gameService.fetchGame(data.gameId);

    // Send restored state to reconnecting player
    socket.emit("game:restore", {
      gameId: data.gameId,
      gameType: data.gameType,
      game,
    });

    logger.info(`User ${socket.id} reconnected to game ${data.gameId} (${data.gameType})`);
  } catch (err) {
    logger.error("Error reconnecting to game", { error: err });
    socket.emit("game:error", { message: "Failed to reconnect" });
  }
});

}
