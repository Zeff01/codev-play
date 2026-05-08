import { pool } from "@/config/db";
import { GameModel } from "./game.model";
import { Chess } from "chess.js";

export interface ChessData {
    fen_position: string;
    pgn_data: string;
    current_turn: 'w' | 'b';

    white_player_id: number;
    black_player_id: number;

    time_control: string;
    increment?:number;
    white_time_left: number;
    black_time_left: number;
    last_move_at?: number;

    status: string;
    is_check: boolean;
    winner: 'white' | 'black' | null;
}

export class ChessModel extends GameModel<ChessData> {

  // 1️⃣ Create Game
    async createGame(gameData: ChessData): Promise<any> {
    const query = `
        INSERT INTO Games (
            white_player_id,
            black_player_id,
            status,
            time_control,
            pgn_data,
            fen_position,
            current_turn,
            white_time_left,
            black_time_left,
            last_move_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
    `;

    const values = [
        gameData.white_player_id,
        gameData.black_player_id,
        gameData.status || "ongoing",
        gameData.time_control,
        gameData.pgn_data || "",
        gameData.fen_position || new Chess().fen(),
        gameData.current_turn || "w",
        gameData.white_time_left,
        gameData.black_time_left,
        gameData.last_move_at,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
}

  // 2️⃣ Get Game + Moves
  async getGameData(gameId: string): Promise<any> {

    const query = `
      SELECT g.*,
      COALESCE(
        (
          SELECT json_agg(m.* ORDER BY m.move_number)
          FROM Moves m
          WHERE m.game_id = g.game_id
        ),
        '[]'
      ) as moves
      FROM Games g
      WHERE g.game_id = $1;
    `;

    const result = await pool.query(query, [gameId]);
    return result.rows[0];
  }

  // 3️⃣ Update Game State
async updateGameState(gameId: string, gameData: any): Promise<any> {
    const fields: string[] = [];
    const values: any[] = [];
    let i = 1;

    if (gameData.pgn !== undefined)           { fields.push(`pgn_data = $${i++}`);       values.push(gameData.pgn); }
    if (gameData.fen_position !== undefined)  { fields.push(`fen_position = $${i++}`);   values.push(gameData.fen_position); }
    if (gameData.current_turn !== undefined)  { fields.push(`current_turn = $${i++}`);   values.push(gameData.current_turn); }
    if (gameData.status !== undefined)        { fields.push(`status = $${i++}`);          values.push(gameData.status); }
    if (gameData.winner !== undefined)        { fields.push(`winner = $${i++}`);          values.push(gameData.winner); }
    if (gameData.is_check !== undefined)      { fields.push(`is_check = $${i++}`);        values.push(gameData.is_check); }
    if (gameData.white_time_left !== undefined){ fields.push(`white_time_left = $${i++}`);values.push(gameData.white_time_left); }
    if (gameData.black_time_left !== undefined){ fields.push(`black_time_left = $${i++}`);values.push(gameData.black_time_left); }
    if (gameData.last_move_at !== undefined)  { fields.push(`last_move_at = $${i++}`);   values.push(gameData.last_move_at); }
    if (gameData.draw_status !== undefined)   { fields.push(`draw_status = $${i++}`);    values.push(gameData.draw_status); }
    if (gameData.draw_offer_by !== undefined) { fields.push(`draw_offer_by = $${i++}`);  values.push(gameData.draw_offer_by); }

    if (fields.length === 0) throw new Error("No fields to update");

    values.push(gameId);
    const query = `UPDATE Games SET ${fields.join(", ")} WHERE game_id = $${i} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
}

  // 4️⃣ Reset Game
  async resetGame(gameId: string): Promise<any> {

    await pool.query(
      "DELETE FROM Moves WHERE game_id = $1",
      [gameId]
    );

    const query = `
      UPDATE Games
      SET
        pgn_data = '',
        fen_position = $1,
        current_turn = 'w',
        status = 'ongoing',
        start_time = CURRENT_TIMESTAMP
      WHERE game_id = $2
      RETURNING *;
    `;

    const result = await pool.query(query, [
      new Chess().fen(),
      gameId
    ]);

    return result.rows[0];
  }

  // 5️⃣ Active Games
  async getActiveGames(): Promise<any[]> {

    const query = `
      SELECT
        g.*,
        u1.username as white_player,
        u2.username as black_player
      FROM Games g
      JOIN Users u1 ON g.white_player_id = u1.id
      JOIN Users u2 ON g.black_player_id = u2.id
      WHERE g.status = 'ongoing'
      ORDER BY g.start_time DESC;
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  // 6️⃣ Record Move
  async recordMove(data:{
    gameId: string,
    moveNumber: number,
    color: "w" | "b",
    from: string,
    to: string,
    notation: string,
    fenAfter: string,
    piece?: string,
    capture?: string | null,
    promotion?: string | null,
  }): Promise<void> {

    const query = `
      INSERT INTO Moves (
        game_id,
        move_number,
        player_color,
        from_square,
        to_square,
        piece,
        capture,
        promotion,
        notation,
        fen_after
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);
    `;

    await pool.query(query, [
      data.gameId,
      data.moveNumber,
      data.color,
      data.from,
      data.to,
      data.piece || null,
      data.capture ? true : false,
      data.promotion || null,
      data.notation,
      data.fenAfter
    ]);
  }

  async getMoveHistory(gameId:string){
      const query = `SELECT * FROM Moves WHERE game_id = $1 ORDER BY move_number ASC`;
      const result = await pool.query(query, [gameId]);
      return result.rows;
  }
}


