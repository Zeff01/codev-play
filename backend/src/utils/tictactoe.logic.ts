// cell values
export type Player = "X" | "O" | "";
export type Board = ("" | "X" | "O")[];
/**
 * Board Initialization
 * **/
export const initializedBoard = (): ("" | "X" | "O")[] => Array(9).fill("");

/*
Move Validation Logic
Rules to enforce:
  Move must be within bounds (0–2 for row/col).
  Target cell must be empty.
  Cannot place if game is already finished.
 */
export const isValidMove = (board: Board, row: number, col: number): boolean => {
  return row >= 0 && row < 3 && col >= 0 && col < 3 && board[row][col] === "";
};

/*
Win Condition Checking
A player wins if they have three of their marks in:
  Any row
  Any column
  Either diagonal
*/
export const checkWinner = (board: Board): Player | null => {
  const lines: number[][][] = [
    // rows
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    // columns
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    // diagonals
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];

  // for (const line of lines) {
  //   const [[r1, c1], [r2, c2], [r3, c3]] = line;
  //   const value = board[r1][c1];

  //   if (value !== "" && value === board[r2][c2] && value === board[r3][c3]) {
  //     return value;
  //   }
  // }

  return null;
};

/**
 * Draw Condition Detection
 * check if board is full to determine the game is Draw
 */
export const isDraw = (board: Board): boolean => board.flat().every((cell) => cell !== "");
