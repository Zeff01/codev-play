import { auth } from "@/middleware/auth.middleware";
import { ChessModel } from "@/models/chess.model";
import { ChessService } from "@/services/chess/chess.services";
import { Router } from "express";
import { ChessController } from "@/controllers/chess.controller";
import { ChessSocket } from "@/sockets/chess.socket";


const router = Router();
const chessService = new ChessService(new ChessSocket(), new ChessModel());
const controller = new ChessController(chessService);

// Create game
router.post("/chess", auth, controller.createGameController.bind(controller));

// Join game
router.post("/chess/:gameId/join", auth, controller.joinGameController.bind(controller));

// Make move
router.post("/chess/:gameId/move", auth, controller.makeMoveController.bind(controller));

// Get game info
router.get("/chess/:gameId", auth, controller.getGameController.bind(controller));

// Get move history
router.get("/chess/:gameId/moves", auth, controller.getHistoryController.bind(controller));

// Resign
router.post("/chess/:gameId/resign", auth, controller.resignGameController.bind(controller));

// Draw
router.post("/chess/:gameId/draw/offer", auth, controller.offerDrawController.bind(controller));
router.post("/chess/:gameId/draw/accept", auth, controller.acceptDrawController.bind(controller));
router.post("/chess/:gameId/draw/reject", auth, controller.rejectDrawController.bind(controller));


export default router;