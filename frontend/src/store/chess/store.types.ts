import type {
  ChessPhase,
  Color,
  GameStatus,
  MoveEntry,
  ValidationResult,
  Room,
} from "@/types/chess.type";
import type { Socket } from "socket.io-client";

export interface RoomSlice {
  phase: ChessPhase;
  rooms: Room[];
  currentRoom: Room | null;
  setPhase: (phase: ChessPhase) => void;
  setRooms: (rooms: Room[]) => void;
  joinRoom: (room: Room) => void;
  leaveRoom: () => void;
}

export interface GameSlice {
  socket:null | any;
  setSocket: (socket: Socket) => void;
  gameId: string | null;
  setGameId: (gameId: string) => void;
  showDrawModal: boolean;
  setShowDrawModal: (show: boolean) => void;
  position: string;
  activeColor: Color;
  status: GameStatus;
  moveHistory: MoveEntry[];
  lastValidation: ValidationResult | null;
  playerColor: Color | null;
  clocks: { w: number; b: number };
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

// Stitching the interfaces together to make the Master Store Type
export type ChessStore = RoomSlice & GameSlice;
