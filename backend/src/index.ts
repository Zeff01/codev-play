import express, { Request, Response, NextFunction } from "express";
import AppError from "./middleware/AppError";
import UserRoutes from "./routes/auth.UserRoutes";
import snakeRoutes from "./routes/snake.route";

// Utils
import cors from "cors";
import dotenv from "dotenv";
import logger from "./utils/logger";
import requestLogger from "./middleware/requestLogger";

// Servers
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { initializeSocket } from "./config/socket-server";
import http from "http";
import { pool, connectDB } from "./config/db";


dotenv.config();

// Constant Variables
const app = express();
const server = http.createServer(app);

// PORT
const PORT = 5000;

// Middleware
app.use(cors({origin: "http://localhost:4000", credentials: true}));
app.use(express.json());
app.use(requestLogger);
app.use(cookieParser());

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

app.use("/api/auth", UserRoutes);
app.use("/api/snake", snakeRoutes);

app.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict', path: '/' });
  res.json({ msg: 'Logged out successfully' });
})

// Socket.io Integration
initializeSocket(server);

// 404 handler — for unknown routes
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Page not found - ${req.originalUrl}`, 404));
});

// Global Error Handlers
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log the error
  logger.error(`${statusCode} - ${message}`, { stack: err.stack });

  const response = {
    success: false,
    message,
    statusCode,
  };

  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
});

// Database Server
async function startServer() {
  try {
    await connectDB();
    logger.info("Database connected successfully.");

    server.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to connect to the database:", error);
    process.exit(1);
  }
}

startServer();
