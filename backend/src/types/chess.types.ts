// types/chess.types.ts — Shared chess type definitions for the backend

export type Color = "w" | "b";
export type GameStatus =
  | "playing"
  | "check"
  | "checkmate"
  | "stalemate"
  | "draw"
  | "resigned";

export interface ChessRoomInfo {
  id: string;
  name: string;
  playerCount: number;
  players: string[]; // socket IDs
  timeControl: number; // seconds
  status: "waiting" | "ready" | "in_progress" | "finished";
}

export interface ChessGameState {
  roomId: string;
  fen: string;
  pgn: string;
  activeColor: Color;
  status: GameStatus;
  moveHistory: ChessMoveEntry[];
  whiteId: string; // socket ID
  blackId: string; // socket ID
  clocks: { w: number; b: number };
  lastMoveTimestamp: number; // Date.now()
  drawOfferedBy: string | null;
  winner: Color | null;
  readyPlayers: Set<string>;
  timeoutHandle: ReturnType<typeof setTimeout> | null;
}

export interface ChessMoveEntry {
  san: string;
  color: Color;
  moveNumber: number;
  from: string;
  to: string;
  promotion?: string;
  timestamp: number; // server Date.now()
}
