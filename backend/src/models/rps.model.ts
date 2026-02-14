import { pool } from "../config/db";
import type { RPSType } from "../utils/rps.logic";
import { GameModel } from "./game.model";

export class RPSModel extends GameModel {
  async createGame(gameData: { best_of_N: number }, userId: number) {
    const result = await pool.query(
      `INSERT INTO public.rockpaperscissors (status, player_one, best_of_N)
    VALUES ('WAITING', $1, $2)
    RETURNING *`,
      [userId, gameData.best_of_N],
    );
    return result.rows[0];
  }

  async getGameData(gameId: string) {
    const result = await pool.query(
      "SELECT * FROM rockpaperscissors WHERE id = $1",
      [gameId],
    );
    return result.rows[0];
  }

  async updateGameState(
    gameId: string,
    gameData: {
      current_round: number;
      p1_points: number;
      p2_points: number;
      status: string;
      winner: number | null;
    },
  ) {
    const result = await pool.query(
      `UPDATE public.rockpaperscissors
    SET 
      current_round = $1,
      p1_points = $2,
      p2_points = $3,
          status = $4,
      winner = $5,
      p1_choice = NULL,
      p2_choice = NULL,
      updated_at = NOW()
    WHERE id = $6,
    RETURNING *`,
      [
        gameData.current_round,
        gameData.p1_points,
        gameData.p2_points,
        gameData.status,
        gameData.winner,
        gameId,
      ],
    );
    return result.rows[0];
  }

  async resetGame(gameId: string) {
    const result = await pool.query(
      `UPDATE public.rockpaperscissors
    SET current_round = 1,
      p1_points = 0,
      p2_points = 0,
      p1_choice = NULL,
      p2_choice = NULL,
      status = 'IN_PROGRESS',
      winner = NULL,
      updated_at = NOW()
    WHERE id = $1 RETURNING *`,
      [gameId],
    );
    return result.rows[0];
  }

  async getActiveGames() {
    const result = await pool.query(
      `SELECT * FROM public.rockpaperscissors
     WHERE status = 'IN_PROGRESS' OR status = 'WAITING'
     ORDER BY created_at DESC`,
    );
    return result.rows;
  }

  // GAME-SPECIFIC LOGIC

  async setPlayer1(gameId: string, userId: number) {
    const result = await pool.query(
      `UPDATE public.rockpaperscissors
        SET player_one = $1,
        status = 'WAITING',
        updated_at = NOW()
        WHERE id = $2
        RETURNING *`,
      [userId, gameId],
    );
    return result.rows[0];
  }

  async setPlayer2AndStart(gameId: string, userId: number) {
    const result = await pool.query(
      `UPDATE public.rockpaperscissors
        SET player_two = $1,
        status = 'IN_PROGRESS',
        updated_at = NOW()
        WHERE id = $2
        RETURNING *`,
      [userId, gameId],
    );
    return result.rows[0];
  }

  async updateChoice(
    id: string,
    player: "p1_choice" | "p2_choice",
    choice: RPSType,
  ) {
    const allowedColumns: Record<typeof player, string> = {
      p1_choice: "p1_choice",
      p2_choice: "p2_choice",
    };

    const column = allowedColumns[player];
    const result = await pool.query(
      `UPDATE public.rockpaperscissors
     SET ${column} = $1, 
         updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
      [choice, id],
    );

    return result.rows[0];
  }

  async resetChoices(gameId: string) {
    const result = await pool.query(
      `UPDATE public.rockpaperscissors SET p1_choice = null, p2_chouce = null, updated_at = NOW()
        WHERE id = $1`,
      [gameId],
    );
  }
}
