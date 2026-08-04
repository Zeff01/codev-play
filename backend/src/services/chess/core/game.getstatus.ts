import { Chess } from 'chess.js';
import { GameStatusResult, GameStatus } from '@/types/chess.type'
import { roomManager } from '@/config/socket-server';


export default function getGameStatus(
    engine: Chess, 
    isTimeout: boolean = false, 
    timedOutPlayer: 'w' | 'b' | null = null
): GameStatusResult {


    function hasSufficientMatingMaterial(engine: Chess, color: 'w' | 'b'): boolean {
    const board = engine.board().flat().filter(sq => sq && sq.color === color);
    const pieceTypes = board.map(sq => sq!.type);

    
    if (pieceTypes.some(t => t === 'q' || t === 'r' || t === 'p')) return true;
    const minorPieces = pieceTypes.filter(t => t === 'b' || t === 'n').length;
    return minorPieces >= 2;
}
    
    if (isTimeout) {
        if (!timedOutPlayer) {
            throw new Error('timedOutPlayer must be provided when isTimeout is true');
        }
    
        const opponentColor = timedOutPlayer === 'w' ? 'b' : 'w';
        const opponent = opponentColor === 'w' ? 'white' : 'black';
        const canOpponentWin = hasSufficientMatingMaterial(engine, opponentColor);

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

    return { winner: null, reason: 'playing', isDraw: false };
}