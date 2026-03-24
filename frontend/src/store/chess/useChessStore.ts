import { create } from "zustand";
import { Chess } from "chess.js";
import type {
  ChessPhase,
  ChessState,
  Color,
  GameStatus,
  MoveEntry,
  Room,
  ValidationResult,
} from "./chess.types";

// Re-export types for components that import from this file
export type { ChessPhase, Color, GameStatus, MoveEntry, ValidationResult, Room };

// Constants

const INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const initialState = {
  phase: "idle" as ChessPhase,
  rooms: [] as Room[],
  currentRoom: null as Room | null,
  position: INITIAL_FEN,
  activeColor: "w" as Color,
  status: "playing" as GameStatus,
  moveHistory: [] as MoveEntry[],
  lastValidation: null as ValidationResult | null,
  playerColor: null as Color | null,
  clocks: { w: 600, b: 600 },

  // Multiplayer state
  roomId: null as string | null,
  playerId: null as string | null,
  opponentId: null as string | null,
  isOnline: false,
  isConnected: false,
  opponentConnected: true,
  drawOfferedBy: null as string | null,
  rematchRequestedBy: null as string | null,
};

// Chess engine (outside store)

const chessEngine = new Chess();

// Helpers

function deriveStatus(engine: Chess): GameStatus {
  if (engine.isCheckmate()) return "checkmate";
  if (engine.isStalemate()) return "stalemate";
  if (engine.isDraw()) return "draw";
  if (engine.isCheck()) return "check";
  return "playing";
}

// Store

export const useChessStore = create<ChessState>((set, get) => ({
  ...initialState,

  // ─── Core Actions (unchanged from local play) ───

  setPhase: (phase) => set({ phase }),

  setRooms: (rooms) => set({ rooms }),

  joinRoom: (room) => set({ currentRoom: room, phase: "room" }),

  leaveRoom: () =>
    set({
      currentRoom: null,
      phase: "lobby",
      roomId: null,
      opponentId: null,
      isOnline: false,
    }),

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
      drawOfferedBy: null,
      rematchRequestedBy: null,
    });
  },

  makeMove: (from, to, promotion) => {
    const state = get();
    if (state.status !== "playing" && state.status !== "check") return;

    // In online mode, don't apply locally — just return and let
    // the socket hook emit the move. The server will respond with
    // chess:moveMade which calls applyServerMove().
    if (state.isOnline) {
      return;
    }

    // Local mode: apply immediately
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

  applyServerMove: (fen, san, color, status) => {
    chessEngine.load(fen);
    set((state) => ({
      position: fen,
      status,
      activeColor: chessEngine.turn() as Color,
      lastValidation: { valid: true },
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

  // ─── Multiplayer Actions ───

  setRoomId: (id) => set({ roomId: id }),

  setPlayerId: (id) => set({ playerId: id }),

  setOpponentId: (id) => set({ opponentId: id }),

  setOnline: (online) => set({ isOnline: online }),

  setConnected: (connected) => set({ isConnected: connected }),

  setOpponentConnected: (connected) => set({ opponentConnected: connected }),

  setDrawOffer: (offeredBy) => set({ drawOfferedBy: offeredBy }),

  setRematchRequest: (requestedBy) =>
    set({ rematchRequestedBy: requestedBy }),

  syncClocks: (clocks) => set({ clocks }),
}));
