import { StateCreator } from "zustand";
import { Chess } from "chess.js";
import type { ChessStore, GameSlice } from "./store.types";
import type { Color } from "@/types/chess.type";
import { deriveStatus, INITIAL_FEN } from "@/lib/chess/chess-utils";

const chessEngine = new Chess();

export const createGameSlice: StateCreator<ChessStore, [], [], GameSlice> = (set, get) => ({
    position: INITIAL_FEN,
    activeColor: "w" as Color,
    status: "playing",
    moveHistory: [],
    lastValidation: null,
    playerColor: null,
    clocks: { w: 600, b: 600 },
    drawOfferedBy: null,

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
        });
    },

    makeMove: (from, to, promotion) => {
        console.log("makeMove called", from, to, "playerColor:", get().playerColor, "activeColor:", get().activeColor);

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

        // Emit move to server
        const { socket, gameId, playerColor } = get();
          if (socket && gameId && playerColor === move.color) {
              socket.emit("game:move", {
                  gameId,
                  gameType: "chess",
                  moveData: { from, to, promotion },
              });
          }
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
            moveHistory: [
                ...state.moveHistory,
                { san, color, moveNumber: Math.floor(state.moveHistory.length / 2) + 1 },
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
        set({
            position: INITIAL_FEN,
            activeColor: "w",
            status: "playing",
            moveHistory: [],
            lastValidation: null,
            playerColor: null,
            clocks: { w: 600, b: 600 },
            drawOfferedBy: null,
            phase: "idle",
            rooms: [],
            currentRoom: null,
            gameId: null,
        });
    },
});