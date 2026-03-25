import { Server, Socket } from "socket.io";
import { RoomManager } from "@/utils/room-manager";
import logger from "@/utils/logger";
import { getUserIdFromSocket } from "../socket-server";
import { GameDisconnectHandler} from "@/services/chess/chess.disconnecthandler";
import { ChessService } from "@/services/chess/chess.services";
import { ChessModel } from "@/models/chess.model";
import { ChessSocket } from "@/sockets/chess.socket";

export function registerDisconnectEvents(
  io: Server,
  socket: Socket,
  roomManager: RoomManager,
  gameType?: "tictactoe" | "snake" | "rps" | "chess"
) {
  socket.on("disconnect", async (reason) => {
    logger.info(`User ${socket.id} disconnected`, { reason });

    const playerRoom = roomManager.getPlayerRoom(socket.id);

    if (playerRoom) {
      roomManager.leaveRoom(playerRoom.id, socket.id);

      socket.to(playerRoom.id).emit("player:left", {
        playerId: socket.id,
        room: roomManager.getRoomInfo(playerRoom.id),
      });

      io.emit("rooms:list", roomManager.listRooms());
    }


    if (gameType === "chess" && playerRoom) {
      const userId = Number(getUserIdFromSocket(socket.id));
      if (!userId) {
        logger.warn(`No userId found for socket ${socket.id}`);
        return;
      }

      const chessSocket = new ChessSocket();
      const chessModel = new ChessModel();
      const chessService = new ChessService(chessSocket, chessModel);

      const gameDisconnect = new GameDisconnectHandler(
        io,
        chessService,
        chessModel,
        chessSocket
      );

      gameDisconnect.handleDisconnect(playerRoom.id, userId);
    }
  });

  socket.on("error", (err) => {
    logger.error("Socket Error", { error: err });
  });
}
