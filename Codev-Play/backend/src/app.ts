import express, { Request, Response, NextFunction } from "express";
import { configureMiddleware } from "./config/middleware";
import { registerRoutes } from "./routes";
import AppError from "./middleware/app-error";

export function createApp() {
  const app = express();

  configureMiddleware(app);
  registerRoutes(app);

  app.use((req, _res, next) => {
    next(new AppError(`Page not found - ${req.originalUrl}`, 404));
  });

  app.use((err: AppError, _req: Request, res: Response, _next: NextFunction) => {
    const statusCode = err.statusCode || 500;

    const response: any = {
      success: false,
      message: err.message || "Internal Server Error",
      statusCode,
    };

    if (process.env.NODE_ENV !== "production") {
      response.stack = err.stack;
    }

    res.status(statusCode).json(response);
  });

  return app;
}
