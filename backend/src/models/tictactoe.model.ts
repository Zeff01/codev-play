import { pool } from "../config/db";
import { Board } from "../utils/tictactoe.logic";
import { GameModel } from "./game.model";

export class ticTacToeModel extends GameModel {
  async createGame(
    gameData: { board: Board; currentPlayer: string },
    userId: number | null,
  ) {
    const result = await pool.query(
      `INSERT INTO public.tictactoe (board, current_player, status, player_x)
     VALUES ($1::jsonb, $2, 'WAITING', $3)
     RETURNING *`,
      [JSON.stringify(gameData.board), gameData.currentPlayer, userId],
    );
    return result.rows[0];
  }

  async getGameData(gameId: string) {
    const result = await pool.query("SELECT * FROM tictactoe WHERE id = $1", [
      gameId,
    ]);
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
      [
        JSON.stringify(gameData.board),
        gameData.current_player,
        gameData.status,
        gameData.winner,
        gameId,
      ],
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
      `SELECT * FROM tictactoe
     WHERE status = 'IN_PROGRESS' OR status = 'WAITING'
     ORDER BY created_at DESC`,
    );
    return result.rows;
  }

  // GAME-SPECIFIC LOGIC

  async setPlayerX(gameId: string, userId: number) {
    const result = await pool.query(
      `UPDATE public.tictactoe
     SET player_x = $1,
         current_player = 'X',
         status = 'WAITING',
         updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
      [userId, gameId],
    );
    return result.rows[0];
  }

  async setPlayerOAndStart(gameId: string, userId: number) {
    const result = await pool.query(
      `UPDATE public.tictactoe
     SET player_o = $1,
         status = 'IN_PROGRESS',
         updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
      [userId, gameId],
    );
    return result.rows[0];
  }
}
