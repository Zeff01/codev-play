// store/chess/chess.types.ts

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

// We export the entire State Interface so the main store can use it
export interface ChessState {
  // Game State
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

  // Multiplayer State
  roomId: string | null;
  playerId: string | null;
  opponentId: string | null;
  isOnline: boolean;
  isConnected: boolean;
  opponentConnected: boolean;
  drawOfferedBy: string | null;
  rematchRequestedBy: string | null;

  // Actions
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

  // Multiplayer Actions
  setRoomId: (id: string | null) => void;
  setPlayerId: (id: string | null) => void;
  setOpponentId: (id: string | null) => void;
  setOnline: (online: boolean) => void;
  setConnected: (connected: boolean) => void;
  setOpponentConnected: (connected: boolean) => void;
  setDrawOffer: (offeredBy: string | null) => void;
  setRematchRequest: (requestedBy: string | null) => void;
  syncClocks: (clocks: { w: number; b: number }) => void;
}
