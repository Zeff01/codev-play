import { getIO } from "@/config/socket-server";
import { ChessData } from "@/types/chess.type";

export class ChessSocket {

  private emitToGameRoom(gameId: string | number, event: string, payload: ChessData) {
    getIO().to(`game:${gameId}`).emit(event, payload);
  }

  chessPlayerJoined(game: ChessData) {
    this.emitToGameRoom(game.game_id, "chess:join", game);
  }

  chessPlayerMoved(game: ChessData) {
    this.emitToGameRoom(game.game_id, "game:move", game);
  }

  emitGameEnd(game: ChessData) {
    this.emitToGameRoom(game.game_id, "chess:end", game);
    this.emitToGameRoom(game.game_id, "game:result", game);
  }

  chessDraw(game: ChessData) {
    this.emitToGameRoom(game.game_id, "chess:draw", game);
  }
}