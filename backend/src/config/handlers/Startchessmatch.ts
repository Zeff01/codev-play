import { Server } from "socket.io";
import { RoomManager } from "@/utils/room-manager";
import { ChessService } from "@/services/chess/chess.services";
import { getUserIdFromSocket } from "@/config/socket-server";
import logger from "@/utils/logger";

/**
 * Starts a chess match for the given room:
 * - Resolves both players' socket ids -> user ids
 * - Assigns white/black
 * - Creates the game via ChessService.startGame
 * - Stores the gameId on the room
 * - Broadcasts "match:started" to everyone in the room
 *
 * Call this from wherever "room:start" is handled, gated on gameType === "chess",
 * without needing to modify room.events.ts's own logic.
 */
export async function startChessMatch(
  io: Server,
  roomManager: RoomManager,
  chessService: ChessService,
  roomId: string,
): Promise<void> {
  const roomInfo = roomManager.getRoomInfo(roomId);
  if (!roomInfo) {
    throw new Error("Room not found");
  }

  if (roomInfo.players.length !== 2) {
    throw new Error("Chess requires exactly 2 players to start");
  }

  const [socketId1, socketId2] = roomInfo.players;
  const userId1 = getUserIdFromSocket(socketId1);
  const userId2 = getUserIdFromSocket(socketId2);

  if (!userId1 || !userId2) {
    throw new Error("Could not resolve players — please reconnect");
  }

  const p1 = Number(userId1);
  const p2 = Number(userId2);
  const whiteId = Math.random() < 0.5 ? p1 : p2;
  const blackId = whiteId === p1 ? p2 : p1;

  // Matches parseTimeControl's expected "base+increment" (minutes) format.
  // Hardcoded for now — thread a real value through Room/RoomInfo once
  // players can pick their own time control.
  const timeControl = "10+0";

  const game = await chessService.startGame(
    { blackPlayerId: blackId, timeControl },
    whiteId,
  );

  roomManager.setGameId(roomId, String((game as any).game_id));

  io.to(roomId).emit("match:started", {
    gameType: "chess",
    gameId: (game as any).game_id,
    game,
  });

  logger.info(`Chess match started in room ${roomId}`, {
    gameId: (game as any).game_id,
    whiteId,
    blackId,
  });
}