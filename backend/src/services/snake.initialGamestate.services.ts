import { GameState, Directions } from '../models/snake.model';
import { generateFood } from './snake.food.services';

export function initializeGameState(): GameState {
    return {
        status: "PLAYING",
        boardWidth: 20,
        boardHeight : 20,
        snakeBody: [{ x: Math.floor(20 / 2), y: Math.floor(20 / 2) }],
        direction: "RIGHT",
        food: { x: 0, y: 0 },
        score: 0
    };
}

