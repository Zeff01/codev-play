export type Choice = "rock" | "paper" | "scissors";
export type RoundResult = "win" | "lose" | "draw";
export type GameMode = "vs-cpu" | "online";
export type GamePhase =
    | "idle"
    | "lobby"
    | "room"
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

export type BaseGameState = {
    phase: GamePhase;
    mode: GameMode | null;
};

export const BEST_OF = 5;
export const WINS_NEEDED = Math.ceil(BEST_OF / 2);

export type RoomData = {
    id: string;
    name: string;
    playerCount: number;
    playerIds: string[];
    createdAt: Date;
    gameType?: string;
    gameId?: string;
};
export type RoomEventData = { success: boolean; room: RoomData };
export type PlayerJoinedData = { playerId: string; room: RoomData };
