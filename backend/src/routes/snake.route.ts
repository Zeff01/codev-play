import { Router } from "express";
import { endGame, getScoreforUser, leaderboard, move, startGame } from "../controllers/snake/snake.start";

const router = Router();

router.post("/start", startGame);
router.post("/move/:gameId", move);
router.post("/end/:gameId", endGame);
router.get("/leaderboard", leaderboard);
router.get("/score/:userId", getScoreforUser);

export default router;   