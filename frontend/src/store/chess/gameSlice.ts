import { StateCreator } from "zustand";
import { Chess } from "chess.js";
import type { ChessStore, GameSlice } from "./store.types";
import type { Color } from "@/types/chess.type";
import { deriveStatus, INITIAL_FEN } from "@/lib/chess/chess-utils";
import { Socket } from "socket.io-client";

// Engine sits outside the state, just like before
const chessEngine = new Chess();

export const createGameSlice: StateCreator<ChessStore, [], [], GameSlice> = (
  set,
  get,
) => ({
  position: INITIAL_FEN,
  activeColor: "w" as Color,
  status: "playing",
  moveHistory: [],
  lastValidation: null,
  playerColor: null,
  clocks: { w: 600, b: 600 },
  socket: null,
  setSocket: (socket) => set({ socket }),
  gameId: null,
  setGameId: (gameId) => {
  if (gameId) localStorage.setItem("chess_gameId", gameId);
  else localStorage.removeItem("chess_gameId");
  set({ gameId });
},
  showDrawModal: false,
  setShowDrawModal: (show) => set({ showDrawModal: show }),

  startGame: (playerColor, timeControl) => {
    chessEngine.reset();
    set({
      gameId: get().gameId, // Keep the same gameId
      phase: "game", // This touches RoomSlice state, which is totally allowed!
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
    if (state.status !== "playing" && state.status !== "check") {
      set({ lastValidation: { valid: false, reason: "Game is not active" } });
      return;
    }

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
      console.log("socket exists?", !!state.socket, "gameId:", state.gameId);
      state.socket?.emit("game:move", {
        gameId: state.gameId,
        gameType: "chess",
        moveData:move
      });


    } catch (err) {
      console.error("Error making move", err);
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

  endGame: (status) => {
      if (typeof window !== "undefined") {
          localStorage.removeItem("chess_gameId");
      }
      set({ status });
  },

  reset: () => {
    chessEngine.reset();
    set({
      // Resetting Game Slice
      position: INITIAL_FEN,
      activeColor: "w",
      status: "playing",
      moveHistory: [],
      lastValidation: null,
      playerColor: null,
      clocks: { w: 600, b: 600 },
      gameId: null,
      // Resetting Room Slice
      showDrawModal: false,
      phase: "idle",
      rooms: [],
      currentRoom: null,
    });
  },
});
