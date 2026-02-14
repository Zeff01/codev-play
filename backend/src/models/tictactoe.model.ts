import { pool } from "../config/db";
import { Board } from "../utils/tictactoe.logic";
import { GameModel } from "./game.model";

export class ticTacToeModel extends GameModel {
  async createGame(gameData: { board: Board; currentPlayer: string }, userId: number | null) {
    const result = await pool.query(
      `INSERT INTO public.tictactoe (board, current_player, status, player_x)
     VALUES ($1::jsonb, $2, 'WAITING', $3)
     RETURNING *`,
      [JSON.stringify(gameData.board), gameData.currentPlayer, userId],
    );
    return result.rows[0];
  }

  async getGameData(gameId: string) {
    const result = await pool.query("SELECT * FROM tictactoe WHERE id = $1", [gameId]);
    return result.rows[0];
  }

  async updateGameState(
    gameId: string,
    gameData: {
      board: Board;
      current_player: string;
      status: string;
      winner: string | null;
    },
  ) {
    const result = await pool.query(
      `UPDATE tictactoe
     SET board = $1,
         current_player = $2,
         status = $3,
         winner = $4,
         updated_at = NOW()
     WHERE id = $5
     RETURNING *`,
      [JSON.stringify(gameData.board), gameData.current_player, gameData.status, gameData.winner, gameId],
    );
    return result.rows[0];
  }

  async resetGame(gameId: string, board?: Board) {
    const result = await pool.query(
      `UPDATE tictactoe
     SET board = $1,
         current_player = 'X',
         status = 'IN_PROGRESS',
         winner = NULL,
         updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
      [JSON.stringify(board), gameId],
    );
    return result.rows[0];
  }

  async getActiveGames() {
    const result = await pool.query(
      `SELECT t.*, 
              ux.username as player_x_username, 
              ux.email as player_x_email,
              uo.username as player_o_username, 
              uo.email as player_o_email
       FROM tictactoe t
       LEFT JOIN users ux ON t.player_x = ux.id
       LEFT JOIN users uo ON t.player_o = uo.id
       WHERE t.status = 'IN_PROGRESS' OR t.status = 'WAITING'
       ORDER BY t.created_at DESC`,
    );
    return result.rows;
  }
}
