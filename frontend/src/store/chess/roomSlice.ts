import { StateCreator } from "zustand";
import type { ChessStore, RoomSlice } from "./store.types";
import type { ChessPhase } from "@/types/chess.type";

export const createRoomSlice: StateCreator<ChessStore, [], [], RoomSlice> = (
  set,
) => ({
  phase: "idle" as ChessPhase,
  rooms: [],
  currentRoom: null,

  setPhase: (phase) => set({ phase }),

  setRooms: (rooms) => set({ rooms }),

  joinRoom: (room) => set({ currentRoom: room, phase: "room" }),

  leaveRoom: () => set({ currentRoom: null, phase: "lobby" }),
});
