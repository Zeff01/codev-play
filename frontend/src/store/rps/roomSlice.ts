import type { StateCreator } from "zustand";
import type { RpsStore } from "./store.types";

type LobbyRoom = {
    id: string;
    name: string;
    players: number;
    gameType?: string;
};

export type RoomSlice = {
    rooms: LobbyRoom[];
    roomId: string | null;
    roomName: string | null;

    setRoomId: (id: string | null) => void;

    isHost: boolean;
    hasOpponent: boolean;

    opponentJoined: () => void;
    createRoom: (name: string) => void;
    joinRoom: (id: string) => void;
    leaveRoom: () => void;
    startMatch: () => void;
    getRooms: () => void;
    updateRooms: (rooms: LobbyRoom[]) => void;
};

export const createRoomSlice: StateCreator<RpsStore, [], [], RoomSlice> = (
    set,
    get,
) => ({
    rooms: [],
    roomId: null,
    roomName: null,
    setRoomId: (id) => set({ roomId: id }),
    isHost: false,
    hasOpponent: false,

    opponentJoined: () => set({ hasOpponent: true }),

    createRoom: (name: string) => {
        const { socket } = get();
        if (!socket) return console.warn("Socket not connected");

        if (!name.trim()) return console.warn("Room name required");

        set({ hasOpponent: false });

        socket.emit("room:create", {
            roomName: name,
            gameType: "rps",
        });
    },

    joinRoom: (id) => {
        const { socket } = get();
        if (!socket) return console.warn("Socket not connected");
        set({ hasOpponent: true });
        socket.emit("room:join", { roomId: id });
    },

    leaveRoom: () => {
        const { socket, roomId } = get();
        if (!socket || !roomId)
            return console.warn("Socket not connected or no room");
        socket.emit("room:leave", { roomId });
        set({ roomId: null, roomName: null, isHost: false });
    },

    startMatch: () => {
        const { isHost, roomId, socket } = get();
        if (!isHost || !roomId || !socket) return;
        socket.emit("room:start", { roomId });
    },

    getRooms: () => {
        const { socket } = get();
        if (!socket) return console.warn("Socket not connected");
        socket.emit("rooms:get");
    },

    updateRooms: (rooms) => set({ rooms }),
});
