import { Server, Socket } from "socket.io";

export function initializeSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    // Handle Messages
    socket.on("chat message", (msg) => {
      try {
        console.log("Message received:", msg);
        io.emit("chat message", msg);
      } catch (err) {
        console.error("Error handling chat message:", err);
      }
    });

    // Handle Disconnection
    socket.on("disconnect", (reason) => {
      console.log(`User ${socket.id} \ndisconnected:`, reason);
    });

    socket.on("error", (err) => {
      console.error("Socket Error", err);
    });
  });

  io.on("connect_error", (err) => {
    console.error("Global socket connection error:", err);
  });
}
