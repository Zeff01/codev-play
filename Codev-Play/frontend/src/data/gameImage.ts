import Pacman from "../../public/pacman.png";
import Chess from "../../public/chess.png";
import Tictactoe from "../../public/tictactoe.png";
import Tetris from "../../public/tetris.png";
import Snake from "../../public/snake.png";
import Minesweeper from "../../public/minesweeper.png";

export const gameImages = [
  { id: 1, name: "Pacman", src: Pacman, alt: "Pacman" },
  { id: 2, name: "Chess", src: Chess, alt: "Chess" },
  { id: 3, name: "TicTacToe", src: Tictactoe, alt: "TicTacToe" },
  { id: 4, name: "Tetris", src: Tetris, alt: "Tetris" },
  { id: 5, name: "Snake", src: Snake, alt: "Snake" },
  { id: 6, name: "Minesweeper", src: Minesweeper, alt: "Minesweeper" },
] as const;
