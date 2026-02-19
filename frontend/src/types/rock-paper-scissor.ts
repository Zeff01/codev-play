export type Choice = "rock" | "paper" | "scissors";
export type RoundResult = "win" | "lose" | "draw";
export type GameMode = "vs-cpu" | "online";
export type GamePhase =
    | "idle"
    | "waiting"
    | "choosing"
    | "revealing"
    | "round-over"
    | "game-over";

export interface Round {
    roundNumber: number;
    playerChoice: Choice;
    opponentChoice: Choice;
    result: RoundResult;
}

export interface Score {
    player: number;
    opponent: number;
}
