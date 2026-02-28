import { Position, Direction, GameStatus } from "@/types/game.type";

export type Directions = Direction;

export type SnakeState = {
  gameId?: number;
  userId?: number;
  status: GameStatus;
  boardWidth: number;
  boardHeight: number;
  snakeBody: Position[];
  direction: Directions;
  food: Position;
  score: number;
  createdAt?: Date;
  endedAt?: Date;
};
