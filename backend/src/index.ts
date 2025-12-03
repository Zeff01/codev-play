import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import { Server } from "socket.io";
import http from "http";
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool, connectDB } from './config/db';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", message: "Codev-Play API is running" });
});

// API routes will be added here
app.get("/api", (_req: Request, res: Response) => {
  res.json({
    message: "Welcome to Codev-Play API",
    version: "1.0.0",
    games: [],
  });
});

// ----------------------------
//    Socket.io Integration
// ----------------------------

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
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("error", (err) => {
    console.error("Socket Error", err);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
async function startServer() {
  try {
    await connectDB(); 
    console.log('Database connected successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
} catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
}

startServer();
