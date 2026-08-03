import { Chess } from "chess.js";
import { ChessModel } from "@/models/chess.model";
import getGameStatus from "./game.getstatus";
import { timeEnd } from "console";
import { ChessData } from "@/types/chess.type";

export class ChessMovement {
    private model = new ChessModel();

    async execute(gameId: string, playerId: number, from: string, to: string, promotion?: string) {
        const game = await this.model.getGameData(gameId);
        if (!game) throw new Error("Game not found!");
        if (game.status !== "playing") throw new Error("Game already finished");
        
        const now = new Date();
        const lastMoveAt = game.last_move_at ? new Date(game.last_move_at) : now;
        const timeSpent = Math.max(0, now.getTime() - lastMoveAt.getTime());
        

        // 1. Turn Validation
        const expectedPlayerId = game.current_turn === 'w' ? game.white_player_id : game.black_player_id;
        if (playerId !== expectedPlayerId) throw new Error("Not your turn!");

        const engine = new Chess();
        
        try {
            
            if (game.pgn_data && game.pgn_data.trim() !== "") {
                engine.loadPgn(game.pgn_data);
            } else {
                engine.load(game.fen_position);
            }
        } catch (e) {
           
            engine.load(game.fen_position);
        }            
        // 2. Move Execution
        const moveResult = engine.move({ 
            from, 
            to, 
            promotion: promotion || 'q' 
        });

        if (!moveResult) throw new Error("Invalid move");
        const isWhiteMoving = game.current_turn === 'w';

        const white_time_left = isWhiteMoving
            ? game.white_time_left - timeSpent + (game.increment ?? 0) * 1000
            : game.white_time_left;

        const black_time_left = !isWhiteMoving
            ? game.black_time_left - timeSpent+ (game.increment ?? 0) * 1000
            : game.black_time_left;


        // 4. Update Main Game State
        const statusResult = getGameStatus(engine);
        const updateData:ChessData= {
            game_id:Number(gameId),
            fen_position: engine.fen(),
            pgn_data: engine.pgn(),
            current_turn: engine.turn(),
            time_control:game.time_control,
            increment: game.increment,
            white_time_left,
            black_time_left, 
            is_check: engine.inCheck(),
            winner: statusResult.winner,
            status: statusResult.reason,
            white_player_id:game.white_player_id,
            black_player_id:game.black_player_id,
            last_move_at:now,
            draw_offer_by: null,
            draw_status:'none',
            

        };

        await this.model.updateGameState(gameId, updateData);
        
        return {
            gameId,
            fen: engine.fen(),
            pgn: engine.pgn(),
            turn: engine.turn(),
            status: statusResult,
            move: moveResult
        };
    }
}