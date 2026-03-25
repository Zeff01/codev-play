export interface Room {
  id: string;
  name: string;
  players: Set<string>;
  createdAt: Date;
  gameType?: "tictactoe" | "snake" | "rps" | "chess";
  gameState?: any;
  gameId?: string;
}

export interface RoomInfo {
  id: string;
  name: string;
  playerCount: number;
  players: string[];
  createdAt: Date;
  gameType?: string;
  gameId?: string;
}
