import { GameState, Position } from "../models/snake.model";

export function generateFood(gameState: GameState): Position {
    const newFood = {
        x: Math.floor(Math.random() * gameState.boardWidth),
        y: Math.floor(Math.random() * gameState.boardHeight)
    };

    const isOnSnake = gameState.snakeBody.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (isOnSnake) {
        return generateFood(gameState);
    }

    return newFood;
}


export function eatFood(gameState: GameState): GameState {
    const head = gameState.snakeBody[0];

    if (head.x === gameState.food.x && head.y === gameState.food.y) {
        return {
            ...gameState,
            score: gameState.score + 10,
            food: generateFood(gameState),
            snakeBody: [...gameState.snakeBody, { ...gameState.snakeBody[gameState.snakeBody.length - 1] }]
        };
    }

    return gameState;
}
