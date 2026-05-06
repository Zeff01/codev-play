import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import { RoomManager } from "@/utils/room-manager";
import logger from "@/utils/logger";

import {
    registerRoomEvents,
    registerGameEvents,
    registerChatEvents,
    registerDisconnectEvents,
    registerChessEvents,
} from "./handlers";

export const userSocketMap = new Map<string, string>();
let ioServer: Server | undefined;
export const roomManager = new RoomManager();

export function initializeSocket(server: HTTPServer) {
    const io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || "*",
            methods: ["GET", "POST"],
        },
    });

    ioServer = io;

    io.on("connection", (socket) => {
        const userId =
            (socket.handshake.query.userId as string) ||
            (socket.handshake.headers["user-id"] as string);

        if (userId) {
            userSocketMap.set(userId, socket.id);
        }

        console.log("A user connected", socket.id);

        socket.on("user:register", ({ userId }) => {
            userSocketMap.set(userId, socket.id);
            socket.data.userId = Number(userId);

            console.log("User registered:", userId, "->", socket.id);
        });

        // initial rooms emit
        socket.emit("rooms:list", {
            rooms: roomManager.listRooms(),
        });

        // handlers
        registerRoomEvents(io, socket, roomManager);
        registerGameEvents(io, socket, roomManager, userSocketMap);
        registerChatEvents(io, socket);
        registerDisconnectEvents(io, socket, roomManager);
        registerChessEvents(io, socket, roomManager, userSocketMap);
    });

    io.on("connect_error", (err) => {
        logger.error("Socket error", { error: err });
    });

    return io;
}

export const getIO = (): Server => {
    if (!ioServer) throw new Error("Socket not initialized");
    return ioServer;
};