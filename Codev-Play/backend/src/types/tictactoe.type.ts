export type tttCreate = {
  board: Board;
  currentPlayer: string;
};
export type Board = ("" | "X" | "O")[];
