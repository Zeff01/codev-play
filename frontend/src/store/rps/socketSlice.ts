import type { StateCreator } from "zustand";
import type { Socket } from "socket.io-client";
import type { RoomEventData, PlayerJoinedData, RoomData } from "@/types/rps";
import type { RpsStore } from "./store.types";

export type SocketSlice = {
    socket: Socket | null;
    setSocket: (socket: Socket) => void;
};

export const createSocketSlice: StateCreator<RpsStore, [], [], SocketSlice> = (
    set,
    get,
) => ({
    socket: null,

    setSocket: (socket) => {
        if (!socket) {
            set({ socket: null });
            return;
        }

        socket.removeAllListeners();

        set({ socket });

        socket.on("room:created", (data: RoomEventData) => {
            if (!data.success) return;

            set({
                roomId: data.room.id,
                roomName: data.room.name,
                isHost: true,
                mode: "online",
                phase: "room",
            });
        });

        socket.on("room:joined", (data: RoomEventData) => {
            if (!data.success) return;

            set({
                roomId: data.room.id,
                roomName: data.room.name,
                isHost: false,
                mode: "online",
                phase: "room",
            });
        });

        socket.on("player:joined", (data: PlayerJoinedData) => {
            console.log("Player joined:", data);
            get().opponentJoined();
        });

        socket.on("rooms:list", (rooms: RoomData[]) => {
            get().updateRooms(
                rooms.map((r) => ({
                    id: r.id,
                    name: r.name,
                    players: r.playerCount,
                    gameType: r.gameType,
                })),
            );
        });

        socket.on("match:started", () => {
            set({ phase: "choosing" });
        });

        socket.on("room:error", (data: { message: string }) => {
            console.error("Room error:", data.message);
        });
    },
});
