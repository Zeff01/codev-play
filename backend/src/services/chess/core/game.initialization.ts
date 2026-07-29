

import { Chess } from "chess.js";
import { ChessModel } from "@/models/chess.model";
import { ChessData } from "@/types/chess.type";


export class ChessBoardInitialize {
    private model = new ChessModel();

    async execute(whiteID: number, blackID: number, timeControl: string = "10+5") {
        if (whiteID === blackID) {
            throw new Error("Players must be different");
            }

        if (!whiteID || !blackID) {
            throw new Error("Both players required");
            }
        if (!Number.isInteger(whiteID) || !Number.isInteger(blackID) || whiteID <= 0 || blackID <= 0) {
            throw new Error("Invalid player IDs");
        }
        
        const engine = new Chess();

      
        const [base, increment] = timeControl.split("+").map(Number);

        const initialData: Omit<ChessData, 'game_id'> = {

            fen_position: engine.fen(),
            pgn_data: "",
            current_turn: "w",
            white_player_id: whiteID,
            black_player_id: blackID,
            time_control: timeControl,
             increment: increment || 0,
            

            white_time_left: base * 60 * 1000,
            black_time_left: base * 60 * 1000,
            last_move_at: new Date(),

            status: "playing",
            is_check: false,
            winner: null,
            draw_offer_by: null,
            draw_status: "No Draw Offered"
        };

        return await this.model.createGame(initialData, whiteID);
    }
}

