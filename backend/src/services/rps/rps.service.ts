import { RPSModel } from "@/models/rps.model";
import { RPSSocket } from "@/sockets/rps.socket";
import { RPSType } from "./rps-logic";
import { GameService } from "@/services/game.service";
import { isValidRPSMove, checkScore, checkWinner } from "./rps-logic";

export class RockPaperScissorsService extends GameService<RPSModel> {
  constructor(
    model: RPSModel,
    private socket: RPSSocket,
  ) {
    super(model);
  }

  async joinGame(gameId: string, userId: number) {
    try {
      const game = await this.model.getGameData(gameId);

      if (!game) throw new Error("Rock-Paper-Scissors game not found.");

      if (game.player_one == userId || game.player_two == userId) {
        return game;
      }

      if (game.player_one && game.player_two) {
        throw new Error("Rock-Paper-Scissors game is full!");
      }

      if (!game.player_one) {
        throw new Error("Rock-Paper-Scissors game has no host.");
      }

      await this.socket.RPSPlayerJoined(game, userId);

      return await this.model.setPlayer2AndStart(gameId, userId);
    } catch (error: any) {
      console.error("[DEBUG] Error caught in joinGame:", error.message);
      throw error;
    }
  }

  async resetExistingGame(gameId: string, userId: number) {
    const game = await this.model.getGameData(gameId);
    if (!game) throw new Error("Game not found!");

    const rematchGame = await this.model.handleRematchRequest(gameId, game);
    if (!rematchGame) throw new Error("Server error");

    await this.socket.RPSRematchRequest(rematchGame, userId);

    return rematchGame;
  }

  async playMove(gameId: string, userId: number, choice: RPSType) {
    const game = await this.model.getGameData(gameId);
    if (!game) throw new Error("Game not found");

    if (game.status !== "IN_PROGRESS" && game.status !== "WAITING") {
      throw new Error("Game already finished");
    }

    if (game.player_one != userId && game.player_two != userId) {
      throw new Error("You are not a player in this game");
    }

    console.log("USER ID: ", userId);

    if (
      (game.player_one == userId && game.p1_choice != null) ||
      (game.player_two == userId && game.p2_choice != null)
    ) {
      throw new Error(
        "You already made a move! Please wait for the other player to finish.",
      );
    }

    if (!isValidRPSMove(choice)) {
      throw new Error("Invalid move.");
    }

    const newGame = await this.model.updateChoice(gameId, userId, choice);
    await this.socket.RPSPlayerMoved(newGame, userId);

    if (newGame.p1_choice != null && newGame.p2_choice != null) {
      const updatedGame = await this.updateScore(gameId);
      return updatedGame;
    }

    return newGame;
  }

  async updateScore(gameId: string) {
    const game = await this.model.getGameData(gameId);
    if (!game) throw new Error("Game not found");

    const roundWinner = checkScore(game.p1_choice, game.p2_choice);

    let p1Points = game.p1_points;
    let p2Points = game.p2_points;

    if (roundWinner === 1) p1Points++;
    if (roundWinner === 2) p2Points++;

    const hasWinner = checkWinner(p1Points, p2Points, game.best_of_n);
    const currentRound =
      hasWinner === 0 ? game.current_round + 1 : game.current_round;

    const gameDataPayload = {
      current_round: currentRound,
      p1_points: p1Points,
      p2_points: p2Points,
      status: hasWinner ? "FINISHED" : "IN_PROGRESS", // "FINISHED" is usually clearer than "WIN"
      winner: hasWinner || null,
    };

    // Overwrite finalGameState with the calculated points/winner state
    const finalGameState = await this.model.updateGameState(
      gameId,
      gameDataPayload,
    );

    return finalGameState;
  }
}
