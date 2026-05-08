import { create } from "zustand";
import type { ChessStore } from "./store.types";
import { createRoomSlice } from "./roomSlice";
import { createGameSlice } from "./gameSlice";
import { createSocketSlice } from "./socketSlice";

export const useChessStore = create<ChessStore>()((...a) => ({
    ...createRoomSlice(...a),
    ...createGameSlice(...a),
    ...createSocketSlice(...a),
}));