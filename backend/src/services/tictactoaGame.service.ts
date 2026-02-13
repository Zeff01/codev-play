import {
  checkWinner,
  initializedBoard,
  isDraw,
  isValidMove,
  Player,
} from "../utils/tictactoe.logic";
import { ticTacToeModel } from "../models/tictactoe.model";
import { GameService } from "./game.service";

export class TicTacToeService extends GameService<ticTacToeModel> {
  constructor(model: ticTacToeModel) {
    super(model);
  }

  async startGame(userId: number | null) {
    const gameData = {
      board: initializedBoard(),
      currentPlayer: "X",
    };

    return await this.model.createGame(gameData, userId);
  }

  async joinGame(gameId: string, userId: number) {
    const game = await this.model.getGameData(gameId);
    if (!game) throw new Error("Game not found");

    // if already in game, return game
    if (game.player_x === userId || game.player_o === userId) {
      return game;
    }

    // if full, block
    if (game.player_x && game.player_o) {
      throw new Error("Game is already full");
    }

    if (!game.player_x) {
      throw new Error(
        "Game has no host (player_x). Create game should set player_x.",
      );
    }

    // assign second player as O and start
    return await this.model.setPlayerOAndStart(gameId, userId);
  }

  //Game State Manager
  //This manages the flow: current player, applying moves, switching turns:

  async playMove(
    gameId: string,
    userId: number | null,
    row: number,
    col: number,
  ) {
    const game = await this.model.getGameData(gameId);
    if (!game) throw new Error("Game not found");

    if (game.status !== "IN_PROGRESS" && game.status !== "WAITING") {
      throw new Error("Game already finished");
    }

    // must be a player
    const isX = game.player_x === userId;
    const isO = game.player_o === userId;
    if (!isX && !isO) throw new Error("You are not a player in this game");

    // must be your turn
    if (
      (game.current_player === "X" && !isX) ||
      (game.current_player === "O" && !isO)
    ) {
      throw new Error("Not your turn");
    }

    const board = game.board;

    if (!isValidMove(board, row, col)) {
      throw new Error("Invalid move");
    }

    board[row][col] = game.current_player;

    const winner = checkWinner(board);
    if (winner) {
      return await this.model.updateGameState(gameId, {
        board,
        current_player: game.current_player,
        status: "WIN",
        winner,
      });
    }

    if (isDraw(board)) {
      return await this.model.updateGameState(gameId, {
        board,
        current_player: game.current_player,
        status: "DRAW",
        winner: null,
      });
    }

    return await this.model.updateGameState(gameId, {
      board,
      current_player: game.current_player === "X" ? "O" : "X",
      status: "IN_PROGRESS",
      winner: null,
    });
  }
}
