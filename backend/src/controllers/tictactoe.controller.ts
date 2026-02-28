import { Request, Response } from "express";
import { TicTacToeService } from "@/services/tictactoe/tictactoe.service";
import { ticTacToeModel } from "@/models/tictactoe.model";
import { TicTacToeSocket } from "@/sockets/tictactoe.socket";
import { GameController } from "./game.controller";

const tttService = new TicTacToeService(
  new ticTacToeModel(),
  new TicTacToeSocket(),
);
type MoveBody = { row: number; col: number };

export class TicTacToeController extends GameController<TicTacToeService> {
  constructor(service: TicTacToeService) {
    super(service);
  }

  async makeMoveController(
    req: Request<{ gameId: string }, unknown, MoveBody>,
    res: Response,
  ): Promise<void> {
    try {
      const { row, col } = req.body;
      if (typeof row !== "number" || typeof col !== "number") {
        res.status(400).json({ error: "row and col must be numbers" });
        return;
      }

      const userId = req.user?.id ? Number(req.user.id) : null;
      if (userId === null) {
        res.status(400).json({ error: "User not found" });
        return;
      }

      const game = await tttService.playMove(
        req.params.gameId,
        userId,
        row,
        col,
      );
      res.json(game);
    } catch (err) {
      const error = err as Error;
      res.status(400).json({ error: error.message || "Invalid move" });
    }
  }
}

/*export const createGameController = async (req: Request, res: Response): Promise<void> => {
  try {
    const Id = req.user?.id ? Number(req.user.id) : null;
    const game = await tttService.startGame(Id);

    res.status(201).json(game);
  } catch (err) {
    const error = err as Error;

    res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
};

export const joinGameController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const gameId = String(req.params?.gameId);

    const game = await tttService.joinGame(gameId, userId);
    console.log(game);

    const socketId = userSocketMap.get(String(userId));
    console.log(socketId);

    const playerRoom = socketId ? roomManager.getPlayerRoom(socketId) : null;
    console.log(playerRoom);

    if (!playerRoom) {
      res.status(404).json({ error: "User has not joined a room!" });
      return;
    }

    const playerRoomId = playerRoom?.id;
    getIO().to(playerRoomId).emit("tictactoe:join", game);

    res.json(game);
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ error: error.message });
  }
};

export const getGameController = async (req: Request<{ gameId: string }>, res: Response): Promise<void> => {
  try {
    const game = await tttService.fetchGame(req.params.gameId);
    res.json(game);
  } catch (err) {
    const error = err as Error;
    res.status(404).json({ error: error.message || "Game not found" });
  }
};

type MoveBody = { row: number; col: number };

export const makeMoveController = async (
  req: Request<{ gameId: string }, unknown, MoveBody>,
  res: Response,
): Promise<void> => {
  try {
    const { row, col } = req.body;
    if (typeof row !== "number" || typeof col !== "number") {
      res.status(400).json({ error: "row and col must be numbers" });
      return;
    }
    const userId = req.user?.id ? Number(req.user.id) : null;
    const game = await tttService.playMove(req.params.gameId, userId, row, col);

    const socketId = userSocketMap.get(String(userId));
    const playerRoom = socketId ? roomManager.getPlayerRoom(socketId) : null;

    if (!playerRoom) {
      res.status(404).json({ error: "User has not joined a room!" });
      return;
    }

    const playerRoomId = playerRoom?.id;
    getIO().to(playerRoomId).emit("tictactoe:update", game);

    res.json(game);
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ error: error.message || "Invalid move" });
  }
};

export const resetGameController = async (req: Request<{ gameId: string }>, res: Response): Promise<void> => {
  try {
    const game = await tttService.resetExistingGame(req.params.gameId);

    const userId = String(game.player_x);
    const socketId = userSocketMap.get(userId);

    const room = socketId ? roomManager.getPlayerRoom(socketId) : null;
    if (room) {
      getIO().to(room.id).emit("tictactoe:reset", game);
    } else {
      res.status(404).json({ error: "User has not joined a room!" });
      return;
    }

    res.json(game);
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ error: error.message || "Failed to reset game" });
  }
};

export const listActiveGamesController = async (req: Request, res: Response): Promise<void> => {
  try {
    const games = await tttService.listActiveGames();
    res.json(games);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};*/
