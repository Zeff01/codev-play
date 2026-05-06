import type {
    ChessPhase,
    Color,
    GameStatus,
    MoveEntry,
    ValidationResult,
    Room,
} from "@/types/chess.type";

export interface RoomSlice {
    phase: ChessPhase;
    rooms: Room[];
    currentRoom: Room | null;
    gameId: string | null;
    setPhase: (phase: ChessPhase) => void;
    setRooms: (rooms: Room[]) => void;
    joinRoom: (room: Room) => void;
    leaveRoom: () => void;
    setGameId: (gameId: string) => void;
}

export interface GameSlice {
    position: string;
    activeColor: Color;
    status: GameStatus;
    moveHistory: MoveEntry[];
    lastValidation: ValidationResult | null;
    playerColor: Color | null;
    clocks: { w: number; b: number };
    drawOfferedBy: number | null;
    startGame: (playerColor: Color, timeControl: number) => void;
    makeMove: (from: string, to: string, promotion?: string) => void;
    setValidation: (result: ValidationResult) => void;
    applyServerMove: (fen: string, san: string, color: Color, status: GameStatus) => void;
    tickClock: (color: Color) => void;
    endGame: (status: GameStatus) => void;
    reset: () => void;
}

export interface SocketSlice {
    socket: import("socket.io-client").Socket | null;
    socketId: string | null;
    setSocket: (socket: import("socket.io-client").Socket) => void;
}

export type ChessStore = RoomSlice & GameSlice & SocketSlice;