import { Request, Response } from "express";
import {
  fetchGame,
  joinGame,
  listActiveGames,
  playMove,
  resetExistingGame,
  startGame,
} from "../services/tictactoaGame.service";

export const createGameController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const Id = req.user?.id ? Number(req.user.id) : null;
    const game = await startGame(Id);

    res.status(201).json(game);
  } catch (err) {
    const error = err as Error;

    res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
};

export const joinGameController = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const gameId = String(req.params!.gameId);
    const game = await joinGame(gameId, userId);
    res.json(game);
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ error: error.message });
  }
};

export const getGameController = async (
  req: Request<{ gameId: string }>,
  res: Response
): Promise<void> => {
  try {
    const game = await fetchGame(req.params.gameId);
    res.json(game);
  } catch (err) {
    const error = err as Error;
    res.status(404).json({ error: error.message || "Game not found" });
  }
};

type MoveBody = { row: number; col: number };

export const makeMoveController = async (
  req: Request<{ gameId: string }, unknown, MoveBody>,
  res: Response
): Promise<void> => {
  try {
    const { row, col } = req.body;
    if (typeof row !== "number" || typeof col !== "number") {
      res.status(400).json({ error: "row and col must be numbers" });
      return;
    }
    const Id = req.user?.id ? Number(req.user.id) : null;
    const game = await playMove(req.params.gameId, Id, row, col);
    res.json(game);
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ error: error.message || "Invalid move" });
  }
};

export const resetGameController = async (
  req: Request<{ gameId: string }>,
  res: Response
): Promise<void> => {
  try {
    const game = await resetExistingGame(req.params.gameId);
    res.json(game);
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ error: error.message || "Failed to reset game" });
  }
};

export const listActiveGamesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const games = await listActiveGames();
    res.json(games);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};
