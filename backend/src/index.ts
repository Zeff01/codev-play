import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import { Server } from "socket.io";
import http from "http";

dotenv.config();

const app = express();
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
