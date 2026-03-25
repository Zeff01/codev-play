import { create } from "zustand";
import { createGameSlice } from "./gameSlice";
import { createRoomSlice } from "./roomSlice";
import { createSocketSlice } from "./socketSlice";
import type { RpsStore } from "./store.types";

export const useRpsStore = create<RpsStore>()((...args) => ({
    phase: "idle",
    mode: null,

    ...createGameSlice(...args),
    ...createRoomSlice(...args),
    ...createSocketSlice(...args),
}));
