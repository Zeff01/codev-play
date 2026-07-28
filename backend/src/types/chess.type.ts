export interface ChessData {
    fen_position: string;
    pgn_data: string;
    current_turn: 'w' | 'b';

    white_player_id: number;
    black_player_id: number;

    time_control: string;
    increment?:number;
    white_time_left: number;
    black_time_left: number;

    status: string;
    is_check: boolean;
    last_move_at:Date;
    winner: 'white' | 'black' | null;

    draw_offer_by: number,
    draw_status:string,
    
}


import { Color } from "chess.js";

export type GameStatus = 
    | 'playing' | 'checkmate' | 'stalemate' | 'repetition' 
    | 'insufficient_material' | '50_move_rule' | 'timeout' 
    | 'timeout_with_insufficient_material' | 'draw';

export interface GameStatusResult {
    winner: 'white' | 'black' | null;
    reason: GameStatus;
    isDraw: boolean;
}

export interface MoveData {
    gameId: string;
    moveNumber: number;
    notation: string;
    from: string;
    to: string;
    fenAfter: string;
    piece: string;
    capture: string | null;
    promotion: string | null;
    color: Color;
}