import { roomManager, userSocketMap } from "@/config/socket-server";
import { getIO } from "@/config/socket-server";
import { RPSType } from "@/types/rps.types";

export class RPSSocket {
  async RPSPlayerJoined(game: RPSType, userId: number) {
    const socketId = userSocketMap.get(String(userId));
    console.log(socketId);

    const playerRoom = socketId ? roomManager.getPlayerRoom(socketId) : null;
    console.log(playerRoom);

    if (!playerRoom) {
      console.warn("User not in room:", userId);
      return;
    }

    const playerRoomId = playerRoom?.id;
    getIO().to(playerRoomId).emit("rps:join", game);
  }

  async RPSPlayerMoved(game: RPSType, userId: number) {
    const socketId = userSocketMap.get(String(userId));
    const playerRoom = socketId ? roomManager.getPlayerRoom(socketId) : null;

    if (!playerRoom) {
      return "User has not joined a room!";
    }

    const playerRoomId = playerRoom?.id;
    getIO().to(playerRoomId).emit("rps:update", game);
  }
}
