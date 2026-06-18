import { describe, test, expect, beforeEach } from '@jest/globals';
const ChessMovement = require('../services/chess/core/game.makeMove');

describe('ChessMovement', () => {
  let chessMovement: any;

  beforeEach(() => {
    chessMovement = new ChessMovement();
  });

    test('should execute a valid move', async () => {
        const updateGame = await chessMovement.execute('game123', 1, 'e2', 'e4');
        expect(updateGame).toBeDefined();
        expect(updateGame.fen_position).toContain('e4');
        expect(updateGame.current_turn).toBe('b');
    });

    test('should throw error for invalid move', async () => {
        await expect(chessMovement.execute('game123', 1, 'e2', 'e5')).rejects.toThrow('Invalid move');
    });

    test('should throw error for wrong turn', async () => {
        await expect(chessMovement.execute('game123', 2, 'e2', 'e4')).rejects.toThrow('Not your turn!');
    });

    test('should throw error for finished game', async () => {
        await expect(chessMovement.execute('finishedGame', 1, 'e2', 'e4')).rejects.toThrow('Game already finished');
    });

});