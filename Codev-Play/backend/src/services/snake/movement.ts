import { SnakeState, Directions } from "@/types/snake.type";

export function wallCollision(gameState: SnakeState): boolean {
  const head = gameState.snakeBody[0];
  return head.x < 0 || head.x >= gameState.boardWidth || head.y < 0 || head.y >= gameState.boardHeight;
}

export function selfCollision(gameState: SnakeState): boolean {
  const head = gameState.snakeBody[0];
  return gameState.snakeBody.slice(1).some((segment) => segment.x === head.x && segment.y === head.y);
}

export function invalidDirectionChange(currentDirection: Directions, newDirection: Directions): boolean {
  return (
    (currentDirection === "UP" && newDirection === "DOWN") ||
    (currentDirection === "DOWN" && newDirection === "UP") ||
    (currentDirection === "LEFT" && newDirection === "RIGHT") ||
    (currentDirection === "RIGHT" && newDirection === "LEFT")
  );
}
