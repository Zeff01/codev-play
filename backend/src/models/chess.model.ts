import { pool } from "@/config/db";
import { GameModel } from "./game.model";
import { ChessData } from "@/types/chess.type";
import { Chess } from "chess.js";

export class ChessModel extends GameModel<ChessData> {

  async createGame(initialData: ChessData, userId: number): Promise<any> {
    const result = await pool.query(
      `INSERT INTO public.chess_game(
          fen_position, pgn_data, current_turn,
          white_player_id, black_player_id,
          time_control, increment,
          white_time_left, black_time_left,
          status, is_check, winner
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        RETURNING *`,
      [
        initialData.fen_position,
        initialData.pgn_data,
        initialData.current_turn,
        initialData.white_player_id ?? userId,
        initialData.black_player_id,
        initialData.time_control,
        initialData.increment ?? null,
        initialData.white_time_left,
        initialData.black_time_left,
        initialData.status,
        initialData.is_check,
        initialData.winner,
      ]
    );

    return result.rows[0];
  }

  async getGameData(gameId: string): Promise<any> {
    const result = await pool.query(
      `SELECT * FROM public.chess_game WHERE id = $1`,
      [gameId]
    );

    return result.rows[0];
  }

  async updateGameState(gameId: string, gameData: ChessData): Promise<any> {
    const result = await pool.query(
      `UPDATE public.chess_game
        SET fen_position = $1,
            pgn_data = $2,
            current_turn = $3,
            white_time_left = $4,
            black_time_left = $5,           
            status = $7,
            is_check = $8,
            winner = $9,
            time_control = $10,
            white_player_id = $11,
            black_player_id =$12
            increment = $13
            updated_at = NOW()
        WHERE id = $10
        RETURNING *`,
      [
        gameData.fen_position,
        gameData.pgn_data,
        gameData.current_turn,
        gameData.white_time_left,
        gameData.black_time_left,
        gameData.status,
        gameData.is_check,
        gameData.winner,
        gameData.time_control,
        gameData.white_player_id,
        gameData.black_player_id,
        gameData.increment,
        gameId,
      ]
    );

    return result.rows[0];
  }

  async getActiveGames(): Promise<any> {
    const result = await pool.query(
      `SELECT * FROM public.chess_game WHERE status = 'active' ORDER BY last_move_at DESC NULLS LAST`
    );

    return result.rows;
  }

  async resetGame(gameId: string): Promise<any> {
    const startingChess = new Chess();

    const result = await pool.query(
      `UPDATE public.chess_game
        SET fen_position = $1,
            pgn_data = $2,
            current_turn = 'w',
            status = 'active',
            is_check = false,
            winner = NULL,
            updated_at = NOW()
        WHERE id = $3
        RETURNING *`,
      [startingChess.fen(), startingChess.pgn(), gameId]
    );

    return result.rows[0];
  }

}
