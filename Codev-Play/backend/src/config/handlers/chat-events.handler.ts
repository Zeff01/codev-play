import { Server, Socket } from "socket.io";
import logger from "@/utils/logger";

export function registerChatEvents(io: Server, socket: Socket) {
  socket.on("chat message", (msg) => {
    try {
      logger.info("Message received from backend", { message: msg });
      io.emit("chat message", msg);
    } catch (err) {
      logger.error("Error handling chat message", { error: err });
    }
  });
}
