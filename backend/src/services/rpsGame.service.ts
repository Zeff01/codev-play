import { RPSModel } from "../models/rps.model";
import { RPSType } from "../utils/rps.logic";
import { GameService } from "./game.service";
import { isValidRPSMove, checkWinner, checkScore } from "../utils/rps.logic";

export class RockPaperScissorsService extends GameService<RPSModel> {
  constructor(model: RPSModel) {
    super(model);
  }

  async joinGame(gameId: string, userId: number) {
    const game = await this.model.getGameData(gameId);
    if (!game) throw new Error("Rock-Paper-Scissors game not found.");
    if (game.player_one == userId || game.player_two == userId) {
      return game;
    }

    if (game.player_one && game.player_two) {
      throw new Error("Rock-Paper-Scissors game is full!");
    }
    if (!game.player_one) {
      throw new Error(
        "Rock-Paper-Scissors game has no host. There must be a player one.",
      );
    }

    return this.model.setPlayer2AndStart(gameId, userId);
  }

  async playMove(
    gameId: string,
    userId: number | null,
    player: "p1_choice" | "p2_choice",
    choice: RPSType,
  ) {
    const game = await this.model.getGameData(gameId);
    if (!game) throw new Error("Game not found");

    if (game.status !== "IN_PROGRESS" && game.status !== "WAITING") {
      throw new Error("Game already finished");
    }

    if (game.player_one != userId && game.player_two != userId) {
      throw new Error("You are not a player in this game");
    }

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

    const newGame = await this.model.updateChoice(gameId, player, choice);

    if (newGame.p1_choice != null && newGame.p2_choice != null) {
      const roundWinner = checkScore(newGame.p1_choice, newGame.p2_choice);

      let p1Points = newGame.p1_points;
      let p2Points = newGame.p2_points;

      if (roundWinner === 1) p1Points++;
      if (roundWinner === 2) p2Points++;

      const hasWinner = checkWinner(p1Points, p2Points, newGame.best_of_N);
      const currentRound =
        hasWinner === 0 ? newGame.current_round : newGame.current_Round + 1;

      const gameDataPayload = {
        current_round: currentRound,
        p1_points: p1Points,
        p2_points: p2Points,
        status: hasWinner ? "WIN" : "IN_PROGRESS",
        winner: hasWinner ?? null,
      };

      return await this.model.updateGameState(gameId, gameDataPayload);
    }

    return newGame;
  }
}
