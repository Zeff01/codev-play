import type { StateCreator } from "zustand";
import type { Socket } from "socket.io-client";
import type { RoomEventData, PlayerJoinedData, RoomData } from "@/types/rps";
import type { RpsStore } from "./store.types";

export type SocketSlice = {
    socket: Socket | null;
    socketId: string | null;
    setSocket: (socket: Socket) => void;
};

export const createSocketSlice: StateCreator<RpsStore, [], [], SocketSlice> = (
    set,
    get,
) => ({
    socket: null,
    socketId: null,

    setSocket: (socket) => {
        if (!socket) {
            set({ socket: null, socketId: null });
            return;
        }

        socket.removeAllListeners();

        set({ socket, socketId: socket.id });

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

        socket.on(
            "rooms:list",
            (data: { gameType?: string; rooms: RoomData[] }) => {
                const currentSocketId = get().socketId;
                const formattedRooms = (data.rooms || []).map((r) => ({
                    id: r.id,
                    name: r.name,
                    players: r.playerCount,
                    gameType: r.gameType,
                    hostId: r.hostId,
                }));

                get().updateRooms(formattedRooms);

                // Check if current user is host of their current room
                const { roomId } = get();
                if (roomId && currentSocketId) {
                    const currentRoom = formattedRooms.find(
                        (r) => r.id === roomId,
                    );
                    if (currentRoom && currentRoom.hostId === currentSocketId) {
                        set({ isHost: true });
                    }
                }
            },
        );

        socket.on("match:started", () => {
            set({ phase: "choosing" });
        });

        socket.on("room:error", (data: { message: string }) => {
            console.error("Room error:", data.message);
        });
    },
});
