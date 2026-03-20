export interface Room {
    id: string;
    name: string;
    hostId: string;
    players: Set<string>;
    createdAt: Date;
    gameType?: "tictactoe" | "snake" | "rps";
    gameState?: any;
    gameId?: string;
}

export interface RoomInfo {
    id: string;
    name: string;
    hostId: string;
    playerCount: number;
    players: string[];
    createdAt: Date;
    gameType?: string;
    gameId?: string;
}
