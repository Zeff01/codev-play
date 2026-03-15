import { Request, Response } from "express";
import { RockPaperScissorsService } from "@/services/rps/rps.service";
import { RPSType } from "@/types/rps.types";
import { GameController } from "./game.controller";

type ChoiceBody = { user: { id: string }; choice: RPSType };

export class RPSController extends GameController<RockPaperScissorsService> {
  constructor(service: RockPaperScissorsService) {
    super(service);
  }

  async makeChoiceController(
    req: Request<{ gameId: string }, any, ChoiceBody>,
    res: Response,
  ) {
    try {
      const { choice, user } = req.body;
      const gameId = req.params.gameId;
      if (!user || !user.id) {
        return res
          .status(400)
          .json({ error: "User ID is required in the request body." });
      }

      const userId = Number(user.id);

      const game = await this.service.playMove(gameId, userId, choice);

      console.log("Move successful:", game);
      return res.json(game);
    } catch (err) {
      const error = err as Error;
      console.error("Move failed:", error.message);
      return res.status(400).json({ error: error.message || "Invalid move" });
    }
  }
}
