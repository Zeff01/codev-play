import { Express } from "express";
import authRoute from "./auth.route";
import snakeRoute from "./snake.route";
import tictactoeRoute from "./tictactoe.route";
import rpsRoute from "./rps.route";
import chessRoute from "./chess.routes";

export function registerRoutes(app: Express) {
  app.use("/api/auth", authRoute);
  app.use("/api/snake", snakeRoute);
  app.use("/api/tictactoe", tictactoeRoute);
  app.use("/api/games/rps", rpsRoute); //fix the route to include "games"
  app.use("/api/games/chess", chessRoute);
}
