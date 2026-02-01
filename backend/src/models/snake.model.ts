

export type Position = {
    x: number;
    y:number;
}

export type Directions= "UP" | "DOWN" | "LEFT" | "RIGHT" ;

export type GameStatus = "PLAYING" | "GAMEOVER" | "FINISHED";


export type GameState =  {
    gameId?: number
    userId?: number
    status: GameStatus
    boardWidth: number
    boardHeight: number
    snakeBody: Position[]
    direction: Directions,
    food: Position
    score: number
    createdAt?: Date
    endedAt?: Date
}
