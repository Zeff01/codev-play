import { Chess } from 'chess.js';
import { GameStatusResult, GameStatus } from '../types/chess.types';

export default function getGameStatus(
    engine: Chess, 
    isTimeout: boolean = false, 
    timedOutPlayer: 'w' | 'b' | null = null
): GameStatusResult {
    
    if (isTimeout && timedOutPlayer) {
        const opponent = timedOutPlayer === 'w' ? 'black' : 'white';
        const canOpponentWin = !engine.isInsufficientMaterial(); 
        return {
            winner: canOpponentWin ? opponent : null,
            reason: canOpponentWin ? 'timeout' : 'timeout_with_insufficient_material',
            isDraw: !canOpponentWin
        };
    }

    if (engine.isCheckmate()) {
        return { 
            winner: engine.turn() === 'w' ? 'black' : 'white', 
            reason: 'checkmate',
            isDraw: false
        };
    }

    if (engine.isDraw()) {
        let reason: GameStatus = 'draw';
        if (engine.isStalemate()) reason = 'stalemate';
        else if (engine.isThreefoldRepetition()) reason = 'repetition';
        else if (engine.isInsufficientMaterial()) reason = 'insufficient_material';
        else reason = '50_move_rule';
        return { winner: null, reason, isDraw: true };
    }

    return { winner: null, reason: 'ongoing', isDraw: false };
}