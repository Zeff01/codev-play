import { Chess } from "chess.js";
import { ChessModel } from "@/models/chess.model";
import getGameStatus from "./game.getstatus";

export class ChessMovement {
    private model = new ChessModel();

    async execute(
        gameId: string,
        playerId: number,
        from: string,
        to: string,
        promotion?: string
    ) {
        const game = await this.model.getGameData(gameId);

        if (!game) throw new Error("Game not found!");
        if (game.status !== "ongoing") throw new Error("Game already finished");

        // 1. Turn validation
        const expectedPlayerId =
            game.current_turn === "w"
                ? game.white_player_id
                : game.black_player_id;

        if (playerId !== expectedPlayerId) {
            throw new Error("Not your turn!");
        }

        // =====================================================
        // ✅ FIX: ONLY USE FEN (NO PGN EVER)
        // =====================================================
        const engine = new Chess(game.fen_position);

        // 2. Move execution
        const moveResult = engine.move({
            from,
            to,
            promotion: promotion || "q",
        });

        if (!moveResult) {
            throw new Error("Invalid move");
        }

        // 3. Compute status (NOW RELIABLE)
        const statusResult = getGameStatus(engine);

        // 4. Save move history
        await this.model.recordMove({
            gameId,
            moveNumber: engine.history().length,
            notation: moveResult.san,
            from: moveResult.from,
            to: moveResult.to,
            fenAfter: engine.fen(),
            piece: moveResult.piece,
            capture: moveResult.captured || null,
            promotion: moveResult.promotion || null,
            color: moveResult.color,
        });

        // 5. Update game state
        const updateData = {
            fen_position: engine.fen(),
            pgn_data: engine.pgn(), // optional for history only
            current_turn: engine.turn(),
            is_check: engine.isCheck(),
            winner: statusResult.winner,
            status: statusResult.reason,
        };

        await this.model.updateGameState(gameId, updateData);

        return {
            gameId,
            fen: engine.fen(),
            pgn: engine.pgn(),
            turn: engine.turn(),
            status: statusResult,
            move: moveResult,
        };
    }
}