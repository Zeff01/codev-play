import { Color } from "chess.js";

export type GameStatus = 
    | 'ongoing' | 'checkmate' | 'stalemate' | 'repetition' 
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