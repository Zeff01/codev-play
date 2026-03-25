import type { BaseGameState } from "@/types/rps";
import type { GameSlice } from "./gameSlice";
import type { RoomSlice } from "./roomSlice";
import type { SocketSlice } from "./socketSlice";

export type RpsStore = BaseGameState & GameSlice & RoomSlice & SocketSlice;
