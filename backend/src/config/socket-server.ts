import { Server, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import { RoomManager } from "@/utils/room-manager";
import logger from "@/utils/logger";
import {
  registerRoomEvents,
  registerGameEvents,
  registerChatEvents,
  registerDisconnectEvents,
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

    console.log("A user connected", socket.id, userSocketMap);

    // Send initial rooms list
    socket.emit("rooms:list", roomManager.listRooms());

    // Register all event handlers
    registerRoomEvents(io, socket, roomManager);
    registerGameEvents(io, socket, roomManager, userSocketMap);
    registerChatEvents(io, socket);
    registerDisconnectEvents(io, socket, roomManager);
  });

  io.on("connect_error", (err) => {
    logger.error("Global socket connection error", { error: err });
  });

  return io;
}

export const getIO = (): Server => {
  if (!ioServer) {
    throw new Error("Socket.io not initialized! Call initSocket first.");
  }
  return ioServer;
};
