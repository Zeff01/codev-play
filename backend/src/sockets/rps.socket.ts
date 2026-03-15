import { roomManager, userSocketMap } from "../config/socket-server";
import { getIO } from "../config/socket-server";
import { RPSGame } from "@/types/rps.types";
export class RPSSocket {
  async RPSPlayerJoined(game: any, userId: number) {
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

  async RPSPlayerMoved(game: RPSGame, userId: number) {
    const socketId = userSocketMap.get(String(userId));
    const playerRoom = socketId ? roomManager.getPlayerRoom(socketId) : null;

    if (!playerRoom) {
      return "User has not joined a room!";
    }
    const playerRoomId = playerRoom?.id;
    const isRoundOver = game.p1_choice && game.p2_choice;

    if (isRoundOver) {
      getIO().to(playerRoomId).emit("rps:reveal", game);
    } else {
      getIO().to(playerRoomId).emit("rps:opponent_moved", {
        userId: userId,
      });
    }
  }

  async RPSRematchRequest(game: RPSGame, userId: number) {
    const socketId = userSocketMap.get(String(userId));
    const playerRoom = socketId ? roomManager.getPlayerRoom(socketId) : null;

    if (!playerRoom) {
      return "User has not joined a room!";
    }
    const playerRoomId = playerRoom?.id;
    if (game.p1_points === 0 && game.p2_points === 0) {
      getIO().to(playerRoomId).emit("rps:reset", game);
    }
    // STEP 3: First person asked, game is in 'WAITING' mode
    else {
      getIO().to(playerRoomId).emit("rps:rematch_waiting", {
        game,
        askedBy: userId,
      });
    }
  }
}
