import { GameModel } from "../models/game.model";

export class GameService<T extends GameModel<any>> {
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
