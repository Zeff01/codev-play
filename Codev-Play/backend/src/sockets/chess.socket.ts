
import { getIO } from "@/config/socket-server";

export class ChessSocket {

  private emitToGameRoom(gameId: string, event: string, payload: any) {
    getIO().to(`game:${gameId}`).emit(event, payload);
  }

  chessPlayerJoined(game: any) {
    this.emitToGameRoom(game.id, "chess:join", game);
  }

  chessPlayerMoved(game: any) {
    this.emitToGameRoom(game.id, "chess:move", game);
  }

  emitGameEnd(game: any) {
    this.emitToGameRoom(game.id, "chess:end", {
      status: game.status,
      winner: game.winner,
      game
    });

    this.emitToGameRoom(game.id, "game:result", {
      gameId: game.id,
      gameType: "chess",
      status: game.status,
      winner: game.winner,
      game
    });
  }

  chessDraw(game: any){
    this.emitToGameRoom(game.id, "chess:draw", {
      drawStatus:game.draw_status,
      offeredBy:game.draw_offer_by,
      status:game.status,
      game
    })
  }


}
