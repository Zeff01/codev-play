import { pool } from "../config/db";
import { Board } from "../utils/tictactoe.logic";

export const setPlayerX = async (gameId: string, userId: string) => {
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
};

export const setPlayerOAndStart = async (gameId: string, userId: string) => {
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
};

export const tictactoeCreateGame = async (board: Board, currentPlayer: string, userId: number | null) => {
  const result = await pool.query(
    `INSERT INTO public.tictactoe (board, current_player, status, player_x)
     VALUES ($1::jsonb, $2, 'WAITING', $3)
     RETURNING *`,
    [JSON.stringify(board), currentPlayer, userId],
  );
  return result.rows[0];
};

export const getGameById = async (id: string) => {
  const result = await pool.query(
    `SELECT t.*, 
            ux.username as player_x_username, 
            ux.email as player_x_email,
            uo.username as player_o_username, 
            uo.email as player_o_email
     FROM tictactoe t
     LEFT JOIN users ux ON t.player_x = ux.id
     LEFT JOIN users uo ON t.player_o = uo.id
     WHERE t.id = $1`,
    [id],
  );
  return result.rows[0];
};

export const updateGame = async (id: string, data: any) => {
  const result = await pool.query(
    `UPDATE tictactoe
     SET board = $1,
         current_player = $2,
         status = $3,
         winner = $4,
         updated_at = NOW()
     WHERE id = $5
     RETURNING *`,
    [JSON.stringify(data.board), data.current_player, data.status, data.winner, id],
  );
  return result.rows[0];
};

export const resetGame = async (id: string, board: Board) => {
  const result = await pool.query(
    `UPDATE tictactoe
     SET board = $1,
         current_player = 'X',
         status = 'IN_PROGRESS',
         winner = NULL,
         updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [JSON.stringify(board), id],
  );
  return result.rows[0];
};

export const getActiveGames = async () => {
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
};
