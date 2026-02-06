

import { GameStatus, GameState, Directions, Position,} from '../models/snake.model.js';


export function snakeMovement(gameState: GameState): GameState {
    const newHead = { ...gameState.snakeBody[0] };

    switch (gameState.direction) {
        case "UP":
            newHead.y -= 1;
            break;
        case "DOWN":
            newHead.y += 1;
            break;
        case "LEFT":
            newHead.x -= 1;
            break;
        case "RIGHT":
            newHead.x += 1;
            break;
        default:
            break;
    }

    const newSnakeBody = [newHead, ...gameState.snakeBody.slice(0, -1)];
    return { ...gameState, snakeBody: newSnakeBody };
}

export function wallCollision(gameState: GameState): boolean {
    const head = gameState.snakeBody[0];
    return head.x < 0 || head.x >= gameState.boardWidth || head.y < 0 || head.y >= gameState.boardHeight;

}

export function selfCollision(gameState: GameState): boolean {
    const head = gameState.snakeBody[0];
    return gameState.snakeBody.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

export function invalidDirectionChange(currentDirection: Directions, newDirection: Directions): boolean {
    return (currentDirection === "UP" && newDirection === "DOWN") ||
        (currentDirection === "DOWN" && newDirection === "UP") ||
        (currentDirection === "LEFT" && newDirection === "RIGHT") ||
        (currentDirection === "RIGHT" && newDirection === "LEFT");
}

