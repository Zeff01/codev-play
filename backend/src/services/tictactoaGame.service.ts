import {
  getActiveGames,
  getGameById,
  resetGame,
  setPlayerOAndStart,
  tictactoeCreateGame,
  updateGame,
} from "../models/tictactoe.model";
import {
  checkWinner,
  initializedBoard,
  isDraw,
  isValidMove,
  Player,
} from "../utils/tictactoe.logic";

export const startGame = async (userId: number | null) => {
  return tictactoeCreateGame(initializedBoard(), "X", userId);
};

export const joinGame = async (gameId: string, userId: string) => {
  const game = await getGameById(gameId);
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
      "Game has no host (player_x). Create game should set player_x."
    );
  }
  // assign second player as O and start
  return setPlayerOAndStart(gameId, userId);
};

export const fetchGame = async (gameId: string) => {
  const game = await getGameById(gameId);
  if (!game) throw new Error("Game not found");
  return game;
};

/**
Game State Manager
This manages the flow: current player, applying moves, switching turns:
 */
export const playMove = async (
  gameId: string,
  userId: number | null,
  row: number,
  col: number
) => {
  const game = await getGameById(gameId);
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
    return updateGame(gameId, {
      board,
      current_player: game.current_player,
      status: "WIN",
      winner,
    });
  }

  if (isDraw(board)) {
    return updateGame(gameId, {
      board,
      current_player: game.current_player,
      status: "DRAW",
      winner: null,
    });
  }

  return updateGame(gameId, {
    board,
    current_player: game.current_player === "X" ? "O" : "X", // switching turns
    status: "IN_PROGRESS",
    winner: null,
  });
};

export const resetExistingGame = async (gameId: string) => {
  const game = await getGameById(gameId);
  if (!game) throw new Error("Game not found");
  return resetGame(gameId, initializedBoard());
};

export const listActiveGames = async () => {
  return getActiveGames();
};
