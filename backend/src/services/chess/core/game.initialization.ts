

import { Chess } from "chess.js";
import { ChessModel } from "@/models/chess.model";
import { ChessData } from "@/models/chess.model";

export class ChessBoardInitialize {
    private model = new ChessModel();

    async execute(whiteID: number, blackID: number, timeControl: string = "10+5") {
        if (whiteID === blackID) {
            throw new Error("Players must be different");
            }

        if (!whiteID || !blackID) {
            throw new Error("Both players required");
            }
        
        const engine = new Chess();
        
      
        const [base, increment] = timeControl.split("+").map(Number);

        const initialData: ChessData = {
            fen_position: engine.fen(),
            pgn_data: "",
            current_turn: "w",
            white_player_id: whiteID,
            black_player_id: blackID,
            time_control: timeControl,
            

            white_time_left: base * 60 * 1000,
            black_time_left: base * 60 * 1000,
            last_move_at: Date.now(),

            status: "ongoing",
            is_check: false,
            winner: null
        };

        return await this.model.createGame(initialData);
    }
}

