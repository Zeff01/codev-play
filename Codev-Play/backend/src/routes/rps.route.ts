import { Router } from "express";
import { RockPaperScissorsService } from "@/services/rps/rps.service";
import { RPSController } from "../controllers/rps.controller";
import { RPSModel } from "@/models/rps.model";
import { RPSSocket } from "@/sockets/rps.socket";
import { auth } from "../middleware/auth.middleware";

const router = Router();
const controller = new RPSController(new RockPaperScissorsService(new RPSModel()));

router.post("/create", auth, controller.createGameController.bind(controller));
router.get("/active", auth, controller.listActiveGamesController.bind(controller));
router.get("/:gameId", auth, controller.getGameController.bind(controller));
router.post("/:gameId/join", auth, controller.joinGameController.bind(controller));
router.post("/:gameId/move", auth, controller.makeMoveController.bind(controller));
router.post("/:gameId/reset", auth, controller.resetGameController.bind(controller));
export default router;
