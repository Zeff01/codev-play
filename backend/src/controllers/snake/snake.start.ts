import { Request, Response, NextFunction } from "express";
import { initializeGameState } from "../../services/snake.initialGamestate.services";
import { generateFood } from "../../services/snake.food.services";
import { pool } from "../../config/db";
import {
  snakeMovement,
  wallCollision,
  selfCollision,
  invalidDirectionChange,
} from "../../services/snake.movement.services";
import { GameState, Directions } from "../../models/snake.model";
import { eatFood } from "../../services/snake.food.services";
import logger from "../../utils/logger";

export async function startGame(req: Request, res: Response, next: NextFunction) {
  try {
    const gameState = initializeGameState();
    gameState.food = generateFood(gameState);
    const { userId } = req.body;
    const result = await pool.query(
      `INSERT INTO snake (id, score, game_state) 
       VALUES ($1, $2, $3) 
       RETURNING score_id`,
      [userId, gameState.score, JSON.stringify(gameState)],
    );

    const gameId = result.rows[0].score_id;

    res.status(201).json({
      success: true,
      gameId,
      state: gameState,
    });
  } catch (error) {
    logger.error("DB Error:", { error });
    next(error);
  }
}

export async function move(req: Request, res: Response, next: NextFunction) {
  try {
    let { gameId, newDirection } = req.body;
    const result = await pool.query(`SELECT game_state FROM snake WHERE score_id = $1`, [gameId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }
    let gameState: GameState = result.rows[0].game_state;

    if (invalidDirectionChange(gameState.direction, newDirection)) {
      newDirection = gameState.direction;
    }

    gameState = snakeMovement(gameState);
    if (wallCollision(gameState) || selfCollision(gameState)) {
      gameState.status = "GAMEOVER";
    } else {
      const foodEaten = eatFood(gameState);
      if (foodEaten) {
        gameState.score += 10;
        gameState.food = generateFood(gameState);
        gameState.snakeBody = foodEaten.snakeBody;
      }
    }
    await pool.query(`UPDATE snake SET game_state = $1, score = $2 WHERE score_id = $3`, [
      gameState,
      gameState.score,
      gameId,
    ]);

    res.json({ success: true, state: gameState });
  } catch (error) {
    console.error("Movement Error:", error);
    next(error);
  }
}

export async function endGame(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameId } = req.body;

    const result = await pool.query(`SELECT score, game_state FROM snake WHERE score_id = $1`, [gameId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Game not found" });
    }

    const gameState: GameState = result.rows[0].game_state;

    if (gameState.status === "GAMEOVER") {
      console.log("Finalizing Game Score:", gameState.score);

      await pool.query(
        `UPDATE snake 
         SET ended_at = NOW(),
             game_state = jsonb_set(game_state, '{status}', '"GAMEOVER"')
         WHERE score_id = $1`,
        [gameId],
      );

      return res.json({
        success: true,
        message: "Game recorded successfully",
        finalScore: result.rows[0].score,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Cannot end game: status is not GAMEOVER yet",
      currentStatus: gameState.status,
    });
  } catch (error) {
    console.error("Game End Error:", error);
    next(error);
  }
}

export async function leaderboard(req: Request, res: Response) {
  try {
    const result = await pool.query(
      `SELECT 
           u.username, s.score,
           MAX(s.score) as high_score
    FROM snake s
    JOIN users u ON s.id = u.id
    GROUP BY u.username, s.score
    ORDER BY high_score DESC
    LIMIT 10;`,
    );

    res.json({ success: true, leaderboard: result.rows });
  } catch (error) {
    console.error("Game End Error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
}

export async function getScoreforUser(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      `SELECT score, created_at 
      FROM snake 
      WHERE id = $1 
      ORDER BY created_at DESC`,
      [userId],
    );

    const allScores = result.rows;

    res.json({ success: true, scores: allScores });
  } catch (error) {
    console.error("Get Score Error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
}
