import { ChessService } from "./chess.services";
import { ChessModel } from "@/models/chess.model";
import { ChessSocket } from "@/sockets/chess.socket";
import { Server } from "socket.io"
import getGameStatus from "./core/game.getstatus";

const disconnectTimers = new Map<string, NodeJS.Timeout>();

export class GameDisconnectHandler {
  constructor(
    private io:Server,
    private chessService: ChessService,
    private chessModel: ChessModel,
    private chessSocket: ChessSocket
  ) {}

  handleDisconnect(gameId: string, userId: number) {
    if (!gameId || !userId) return;

    const key = `${gameId}:${userId}`;

    
    if (disconnectTimers.has(key)) {
      clearTimeout(disconnectTimers.get(key)!);
    }

    const timer = setTimeout(async () => {
      const game = await this.chessService.fetchGame(gameId);
      if (!game || game.status !== "ongoing") return;

      const isWhite = game.white_player_id === userId;
      const winner = isWhite ? "black" : "white";

      const updatedGame = await this.chessModel.updateGameState(gameId, {
        status: "disconnect",
        winner,
      });
      
      
      this.chessSocket.emitGameEnd(updatedGame);
       this.io.to(`game:${gameId}`).emit("game:result", {
        gameId,
        winner,       
        game,         
});

      disconnectTimers.delete(key);
    }, 60000

);

    disconnectTimers.set(key, timer);
  }

    handleReconnect(gameId:string, userId:number){
        const key = `${gameId}:${userId}`;
        if(disconnectTimers.has(key)){
            clearTimeout(disconnectTimers.get(key)!)
            disconnectTimers.delete(key)
        }
    }

}