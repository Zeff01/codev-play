import { StateCreator } from "zustand";
import type { ChessStore, RoomSlice } from "./store.types";
import type { ChessPhase, Room } from "@/types/chess.type";

export const createRoomSlice: StateCreator<ChessStore, [], [], RoomSlice> = (set) => ({
    phase: "idle" as ChessPhase,
    rooms: [],
    currentRoom: null,
    gameId: null,

    setPhase: (phase) => set({ phase }),
    setRooms: (rooms) => set({ rooms }),
    joinRoom: (room: Room) => set({ currentRoom: room, phase: "room" }),
    leaveRoom: () => set({ currentRoom: null, phase: "lobby" }),
    setGameId: (gameId) => set({ gameId }),
});