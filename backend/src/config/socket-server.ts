import { Server, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import { RoomManager } from "../utils/RoomManager";

export const userSocketMap = new Map<string, string>();
let ioServer: Server | undefined;
export const roomManager = new RoomManager();

export function initializeSocket(server: HTTPServer) {
  const io = new Server(server, {
    cors: {
      origin: "*",
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

    // ROOM MANAGEMENT

    // Create a room
    socket.on("room:create", (data: { roomName?: string }) => {
      try {
        const room = roomManager.createRoom(socket.id, data?.roomName);
        socket.join(room.id);

        socket.emit("room:created", {
          success: true,
          room: roomManager.getRoomInfo(room.id),
        });

        // Broadcast updated room list
        io.emit("rooms:list", roomManager.listRooms());
      } catch (err) {
        console.error("Error creating room:", err);
        socket.emit("room:error", { message: "Failed to create room" });
      }
    });

    // Join a room
    socket.on("room:join", (data: { roomId: string }) => {
      try {
        const success = roomManager.joinRoom(data.roomId, socket.id);

        if (!success) {
          socket.emit("room:error", { message: "Room not found" });
          return;
        }

        socket.join(data.roomId);

        socket.emit("room:joined", {
          success: true,
          room: roomManager.getRoomInfo(data.roomId),
        });

        // Notify others in the room
        socket.to(data.roomId).emit("player:joined", {
          playerId: socket.id,
          room: roomManager.getRoomInfo(data.roomId),
        });

        // Broadcast updated room list
        io.emit("rooms:list", roomManager.listRooms());
      } catch (err) {
        console.error("Error joining room:", err);
        socket.emit("room:error", { message: "Failed to join room" });
      }
    });

    // Leave a room
    socket.on("room:leave", (data: { roomId: string }) => {
      try {
        roomManager.leaveRoom(data.roomId, socket.id);
        socket.leave(data.roomId);

        socket.emit("room:left", { success: true });

        // Notify others in the room
        socket.to(data.roomId).emit("player:left", {
          playerId: socket.id,
          room: roomManager.getRoomInfo(data.roomId),
        });

        // Broadcast updated room list
        io.emit("rooms:list", roomManager.listRooms());
      } catch (err) {
        console.error("Error leaving room:", err);
        socket.emit("room:error", { message: "Failed to leave room" });
      }
    });

    // Get list of available rooms
    socket.on("rooms:get", () => {
      socket.emit("rooms:list", roomManager.listRooms());
    });

    // Get specific room info
    socket.on("room:get", (data: { roomId: string }) => {
      const roomInfo = roomManager.getRoomInfo(data.roomId);
      if (roomInfo) {
        socket.emit("room:info", roomInfo);
      } else {
        socket.emit("room:error", { message: "Room not found" });
      }
    });

    // CHAT MESSAGES

    // Handle Messages (global broadcast)
    socket.on("chat message", (msg) => {
      try {
        console.log("Message received:", msg);
        io.emit("chat message", msg);
      } catch (err) {
        console.error("Error handling chat message:", err);
      }
    });

    // DISCONNECT HANDLING

    // Handle Disconnection
    socket.on("disconnect", (reason) => {
      console.log(`User ${socket.id} disconnected:`, reason);

      // Find and leave any room the player was in
      const playerRoom = roomManager.getPlayerRoom(socket.id);
      if (playerRoom) {
        roomManager.leaveRoom(playerRoom.id, socket.id);

        // Notify others in the room
        socket.to(playerRoom.id).emit("player:left", {
          playerId: socket.id,
          room: roomManager.getRoomInfo(playerRoom.id),
        });

        // Broadcast updated room list
        io.emit("rooms:list", roomManager.listRooms());
      }
    });

    socket.on("error", (err) => {
      console.error("Socket Error", err);
    });
  });

  io.on("connect_error", (err) => {
    console.error("Global socket connection error:", err);
  });

  return io;
}

export const getIO = (): Server => {
  if (!ioServer) {
    throw new Error("Socket.io not initialized! Call initSocket first.");
  }
  return ioServer;
};
