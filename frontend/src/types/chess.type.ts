export type ChessPhase = "idle" | "lobby" | "room" | "game";
export type Color = "w" | "b";
export type GameStatus =
  | "playing"
  | "check"
  | "checkmate"
  | "stalemate"
  | "draw"
  | "resigned";

export interface MoveEntry {
  san: string;
  color: Color;
  moveNumber: number;
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

export interface Room {
  id: string;
  name: string;
  players: number;
  maxPlayers: 2;
  timeControl: number;
}

export interface ChessState {
  phase: ChessPhase;
  rooms: Room[];
  currentRoom: Room | null;
  position: string;
  activeColor: Color;
  status: GameStatus;
  moveHistory: MoveEntry[];
  lastValidation: ValidationResult | null;
  playerColor: Color | null;
  clocks: { w: number; b: number };
  setPhase: (phase: ChessPhase) => void;
  setRooms: (rooms: Room[]) => void;
  joinRoom: (room: Room) => void;
  leaveRoom: () => void;
  startGame: (playerColor: Color, timeControl: number) => void;
  makeMove: (from: string, to: string, promotion?: string) => void;
  setValidation: (result: ValidationResult) => void;
  applyServerMove: (
    fen: string,
    san: string,
    color: Color,
    status: GameStatus,
  ) => void;
  tickClock: (color: Color) => void;
  endGame: (status: GameStatus) => void;
  reset: () => void;
}

// Mirrors the backend's ChessData shape as it arrives over JSON
// (Socket.io / REST responses) — Date fields become ISO strings once serialized.
export interface ChessData {
  game_id: number;
  fen_position: string;
  pgn_data: string;
  current_turn: Color;

  white_player_id: number;
  black_player_id: number;

  time_control: string;
  increment?: number;
  white_time_left: number;
  black_time_left: number;

  status: string; // or GameStatus, if the backend's status strings match 1:1
  is_check: boolean;
  last_move_at: string;
  winner: "white" | "black" | null;

  draw_status: "none" | "offered" | "declined" | "accepted";
  draw_offer_by: number | null;
  last_draw_offer_at: string | null;
}