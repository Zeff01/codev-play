import { Router } from "express";
import {
  createGameController,
  getGameController,
  makeMoveController,
  resetGameController,
  listActiveGamesController,
  joinGameController,
} from "../controllers/tictactoe.controller";
import { auth } from "../middleware/auth.middleware";

const router = Router();

//without auth and multiplayer
//router.post("/create", createGameController);
//router.get("/active", listActiveGamesController);
//router.get("/:gameId", getGameController);
//router.post("/:gameId/move", makeMoveController);
//router.post("/:gameId/reset", resetGameController);

/**
 * uncomment this if you want to try
 * with auth and multiplayer
 */
router.post("/create", auth, createGameController);
router.get("/active", auth, listActiveGamesController);
router.get("/:gameId", auth, getGameController);
router.post("/:gameId/join", auth, joinGameController); // to join a game must autheticate first
router.post("/:gameId/move", auth, makeMoveController);
router.post("/:gameId/reset", auth, resetGameController);
export default router;
