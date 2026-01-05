export interface Room {
  id: string;
  name: string;
  players: Set<string>;
  createdAt: Date;
}

export interface RoomInfo {
  id: string;
  name: string;
  playerCount: number;
  players: string[];
  createdAt: Date;
}
