import { Router } from "express";
import { TicTacToeController } from "@/controllers/tictactoe.controller";
import { TicTacToeService } from "@/services/tictactoe/tictactoe.service";
import { ticTacToeModel } from "@/models/tictactoe.model";
import { TicTacToeSocket } from "@/sockets/tictactoe.socket";
import { auth } from "@/middleware/auth.middleware";

const router = Router();
const controller = new TicTacToeController(new TicTacToeService(new ticTacToeModel(), new TicTacToeSocket()));

router.post("/create", auth, controller.createGameController.bind(controller));
router.get("/active", auth, controller.listActiveGamesController.bind(controller));
router.get("/:gameId", auth, controller.getGameController.bind(controller));
router.post("/:gameId/join", auth, controller.joinGameController.bind(controller));
router.post("/:gameId/move", auth, controller.makeMoveController.bind(controller));
router.post("/:gameId/reset", auth, controller.resetGameController.bind(controller));

export default router;
