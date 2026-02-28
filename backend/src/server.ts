import dotenv from "dotenv";
import http from "http";
import { createApp } from "@/app";
import { connectDB } from "@/config/db";
import { initializeSocket } from "@/config/socket-server";
import logger from "@/utils/logger";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    logger.info("Database connected successfully.");

    const app = createApp();
    const server = http.createServer(app);

    initializeSocket(server);

    server.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Startup failed:", error);
    process.exit(1);
  }
}

start();
