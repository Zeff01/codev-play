import express from "express";
import cookieParser from "cookie-parser";
import { Express, Request, Response } from "express";
import cors from "cors";
import requestLogger from "@/utils/request-logger";

export function configureMiddleware(app: Express) {
  if (!process.env.CORS_ORIGIN) {
    throw new Error("CORS_ORIGIN is not defined");
  }

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(cookieParser());

  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", message: "Codev-Play API is running" });
  });

  app.use(requestLogger);
}
