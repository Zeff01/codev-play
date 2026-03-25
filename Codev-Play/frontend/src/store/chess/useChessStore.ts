import { create } from "zustand";
import { Chess } from "chess.js";

// Types

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

interface ChessState {
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
    applyServerMove: (fen: string, san: string, color: Color, status: GameStatus) => void;
    tickClock: (color: Color) => void;
    endGame: (status: GameStatus) => void;
    reset: () => void;
}

// Constants

const INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const initialState = {
    phase: "idle" as ChessPhase,
    rooms: [],
    currentRoom: null,
    position: INITIAL_FEN,
    activeColor: "w" as Color,
    status: "playing" as GameStatus,
    moveHistory: [],
    lastValidation: null,
    playerColor: null,
    clocks: { w: 600, b: 600 },
};

// Chess engine (outside store)

const chessEngine = new Chess();

// Helpers

function deriveStatus(engine: Chess): GameStatus {
    console.log("deriveStatus:", {
        isCheckmate: engine.isCheckmate(),
        isStalemate: engine.isStalemate(),
        isDraw: engine.isDraw(),
        isCheck: engine.isCheck(),
    });
    if (engine.isCheckmate()) return "checkmate";
    if (engine.isStalemate()) return "stalemate";
    if (engine.isDraw()) return "draw";
    if (engine.isCheck()) return "check";
    return "playing";
}

// Store
// TODO: [F503 - Handle real-time moves] Add socket: Socket | null and setSocket() here
// setSocket() registers all chess:* socket events (see F503 PR10)
export const useChessStore = create<ChessState>((set, get) => ({
    ...initialState,

    setPhase: (phase) => set({ phase }),

    setRooms: (rooms) => set({ rooms }),

    joinRoom: (room) => set({ currentRoom: room, phase: "room" }),

    leaveRoom: () => set({ currentRoom: null, phase: "lobby" }),

    startGame: (playerColor, timeControl) => {
        chessEngine.reset();
        set({
            phase: "game",
            playerColor,
            position: chessEngine.fen(),
            activeColor: "w",
            status: "playing",
            moveHistory: [],
            lastValidation: null,
            clocks: { w: timeControl, b: timeControl },
        });
    },

    makeMove: (from, to, promotion) => {
        const state = get();
        if (state.status !== "playing" && state.status !== "check") return;

        try {
            const move = chessEngine.move({ from, to, promotion });

            if (!move) {
                set({ lastValidation: { valid: false, reason: "Illegal move" } });
                return;
            }
            const status = deriveStatus(chessEngine);
            const moveNumber = Math.floor(state.moveHistory.length / 2) + 1;

            set({
                position: chessEngine.fen(),
                activeColor: chessEngine.turn() as Color,
                status,
                lastValidation: { valid: true },
                moveHistory: [
                    ...state.moveHistory,
                    { san: move.san, color: move.color as Color, moveNumber },
                ],
            });
        } catch {
            set({ lastValidation: { valid: false, reason: "Illegal move" } });
        }
    },

    setValidation: (result) => set({ lastValidation: result }),
    // TODO: [F503 - Handle real-time moves] Called when opponent's move arrives via socket.on("chess:moveMade"
    applyServerMove: (fen, san, color, status) => {
        chessEngine.load(fen);
        set((state) => ({
            position: fen,
            status,
            activeColor: chessEngine.turn() as Color,
            moveHistory: [
                ...state.moveHistory,
                {
                    san,
                    color,
                    moveNumber: Math.floor(state.moveHistory.length / 2) + 1,
                },
            ],
        }));
    },

    tickClock: (color) =>
        set((state) => ({
            clocks: {
                ...state.clocks,
                [color]: Math.max(0, state.clocks[color] - 1),
            },
        })),

    endGame: (status) => set({ status }),

    reset: () => {
        chessEngine.reset();
        set({ ...initialState });
    },
}));