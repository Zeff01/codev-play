import { GameService } from "../services/game.service";
import { Request, Response } from "express";

export class GameController<T extends GameService<any>> {
  constructor(protected service: T) {}

  async createGameController(req: Request, res: Response) {
    try {
      const Id = Number(req.body.user?.id);
      if (!Id || Number.isNaN(Id)) {
        return res.status(401).json({ error: "Invalid user ID" });
      }

      const gameData = req.body.gameData;
      const game = await this.service.startGame(gameData, Id);

      res.status(201).json(game);
    } catch (err) {
      const error = err as Error;

      res.status(500).json({
        error: error.message || "Internal server error",
      });
    }
  }

  async joinGameController(req: Request, res: Response) {
    try {
      const userId = req.body.user!.id;
      const gameId = String(req.params!.gameId);

      const game = await this.service.joinGame(gameId, userId);
      console.log(game);
      res.json(game);
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: error.message });
    }
  }

  async getGameController(req: Request<{ gameId: string }>, res: Response) {
    try {
      const game = await this.service.fetchGame(req.params.gameId);
      res.json(game);
    } catch (err) {
      const error = err as Error;
      res.status(404).json({ error: error.message || "Game not found" });
    }
  }

  async resetGameController(
    req: Request<{ gameId: string }>,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.user?.id || req.body.user?.id;

      if (!userId) {
        res.status(400).json({ error: "User identity required for rematch." });
        return;
      }

      const gameId = req.params.gameId;

      const game = await this.service.resetExistingGame(gameId, Number(userId));

      res.json(game);
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: error.message || "Failed to reset game" });
    }
  }

  async listActiveGamesController(req: Request, res: Response): Promise<void> {
    try {
      const games = await this.service.listActiveGames();
      res.json(games);
    } catch (err) {
      const error = err as Error;
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  }
}

/*export class GameService<T extends GameModel<any>> {
  constructor(protected model: T) {}

  async startGame(gameData: any, userId: number) {
    return await this.model.createGame(gameData, userId);
  }

  async fetchGame(gameId: string) {
    const game = await this.model.getGameData(gameId);
    if (!game) throw new Error("Game not found");
    return game;
  }

  async resetExistingGame(gameId: string, gameData?: any) {
    const game = await this.model.getGameData(gameId);
    if (!game) throw new Error("Game not found");
    return this.model.resetGame(gameId);
  }

  async listActiveGames() {
    return await this.model.getActiveGames();
  }
}
 */
