export abstract class GameModel<GameData = unknown> {
  abstract createGame(gameData: GameData, userId: number): Promise<any>;
  abstract getGameData(gameId: string): Promise<any>;
  abstract updateGameState(gameId: string, gameData: GameData): Promise<any>;
  abstract resetGame(gameId: string): Promise<any>;
  abstract getActiveGames(): Promise<any>;
}
