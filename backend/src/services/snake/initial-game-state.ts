import { SnakeState } from "@/types/snake.type";
import { GameStatus, Direction } from "@/types/game.type";

export function initializeGameState(): SnakeState {
  return {
    status: GameStatus.PLAYING,
    boardWidth: 20,
    boardHeight: 20,
    snakeBody: [{ x: Math.floor(20 / 2), y: Math.floor(20 / 2) }],
    direction: Direction.RIGHT,
    food: { x: 0, y: 0 },
    score: 0,
  };
}
