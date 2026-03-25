export type Position = { x: number; y: number };
export type Player = 1 | 2 | 0;

export enum GameStatus {
  PLAYING = "PLAYING",
  WAITING = "WAITING",
  IN_PROGRESS = "IN_PROGRESS",
  GAMEOVER = "GAMEOVER",
  FINISHED = "FINISHED",
}

export enum Direction {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}
