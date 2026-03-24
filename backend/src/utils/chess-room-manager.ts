// utils/chess-room-manager.ts — In-memory Map<roomId, ChessGameState>
// Manages the chess-specific game state separately from the generic RoomManager.

import { Chess } from "chess.js";
import {
  ChessGameState,
  ChessRoomInfo,
  ChessMoveEntry,
  Color,
  GameStatus,
} from "@/types/chess.types";

export class ChessRoomManager {
  private games: Map<string, ChessGameState> = new Map();
  private engines: Map<string, Chess> = new Map();

  /**
   * Initialize a new chess game for the given room.
   * Called when both players are ready.
   */
  createGame(
    roomId: string,
    whiteId: string,
    blackId: string,
    timeControl: number,
  ): ChessGameState {
    const engine = new Chess();

    const state: ChessGameState = {
      roomId,
      fen: engine.fen(),
      pgn: "",
      activeColor: "w",
      status: "playing",
      moveHistory: [],
      whiteId,
      blackId,
      clocks: { w: timeControl, b: timeControl },
      lastMoveTimestamp: Date.now(),
      drawOfferedBy: null,
      winner: null,
      readyPlayers: new Set(),
      timeoutHandle: null,
    };

    this.games.set(roomId, state);
    this.engines.set(roomId, engine);
    return state;
  }

  getGame(roomId: string): ChessGameState | undefined {
    return this.games.get(roomId);
  }

  getEngine(roomId: string): Chess | undefined {
    return this.engines.get(roomId);
  }

  /**
   * Calculate remaining time for both players (on-demand, no setInterval).
   * The active player's clock is decremented by time elapsed since lastMoveTimestamp.
   */
  calculateClocks(game: ChessGameState): { w: number; b: number } {
    const elapsed = (Date.now() - game.lastMoveTimestamp) / 1000;
    return {
      ...game.clocks,
      [game.activeColor]: Math.max(
        0,
        game.clocks[game.activeColor] - elapsed,
      ),
    };
  }

  /**
   * Attempt to make a move. Returns the move result or null if invalid.
   */
  makeMove(
    roomId: string,
    socketId: string,
    from: string,
    to: string,
    promotion?: string,
  ): {
    success: boolean;
    game?: ChessGameState;
    san?: string;
    error?: string;
  } {
    const game = this.games.get(roomId);
    const engine = this.engines.get(roomId);
    if (!game || !engine) {
      return { success: false, error: "Game not found" };
    }

    // Verify it's this player's turn
    const expectedPlayer =
      game.activeColor === "w" ? game.whiteId : game.blackId;
    if (socketId !== expectedPlayer) {
      return { success: false, error: "Not your turn" };
    }

    // Deduct time for the current player BEFORE the move
    const elapsed = (Date.now() - game.lastMoveTimestamp) / 1000;
    game.clocks[game.activeColor] = Math.max(
      0,
      game.clocks[game.activeColor] - elapsed,
    );

    // Check for timeout
    if (game.clocks[game.activeColor] <= 0) {
      game.status = "checkmate"; // use checkmate status for timeout as well
      game.winner = game.activeColor === "w" ? "b" : "w";
      return {
        success: false,
        error: "Time expired",
        game,
      };
    }

    // Attempt the move
    try {
      const moveResult = engine.move({ from, to, promotion });
      if (!moveResult) {
        return { success: false, error: "Illegal move" };
      }

      // Derive status
      let status: GameStatus = "playing";
      if (engine.isCheckmate()) status = "checkmate";
      else if (engine.isStalemate()) status = "stalemate";
      else if (engine.isDraw()) status = "draw";
      else if (engine.isCheck()) status = "check";

      // Build move entry
      const moveEntry: ChessMoveEntry = {
        san: moveResult.san,
        color: moveResult.color as Color,
        moveNumber: Math.floor(game.moveHistory.length / 2) + 1,
        from: moveResult.from,
        to: moveResult.to,
        promotion: moveResult.promotion,
        timestamp: Date.now(),
      };

      // Update game state
      game.fen = engine.fen();
      game.pgn = engine.pgn();
      game.activeColor = engine.turn() as Color;
      game.status = status;
      game.moveHistory.push(moveEntry);
      game.lastMoveTimestamp = Date.now();
      game.drawOfferedBy = null; // Clear any pending draw offer on move

      // Set winner for terminal states
      if (status === "checkmate") {
        game.winner = moveResult.color as Color; // The mover wins
      }

      return { success: true, game, san: moveResult.san };
    } catch {
      return { success: false, error: "Illegal move" };
    }
  }

  /**
   * Mark a player as ready. Returns true if both players are now ready.
   */
  markReady(roomId: string, socketId: string): boolean {
    const game = this.games.get(roomId);
    if (!game) {
      // Store readiness in a temporary map if game doesn't exist yet
      // We'll handle this at the handler level
      return false;
    }
    game.readyPlayers.add(socketId);
    return game.readyPlayers.size >= 2;
  }

  /**
   * End a game (resignation, draw agreement, timeout, etc.)
   */
  endGame(
    roomId: string,
    status: GameStatus,
    winner: Color | null,
  ): ChessGameState | undefined {
    const game = this.games.get(roomId);
    if (!game) return undefined;

    // Clear timeout
    if (game.timeoutHandle) {
      clearTimeout(game.timeoutHandle);
      game.timeoutHandle = null;
    }

    game.status = status;
    game.winner = winner;
    return game;
  }

  /**
   * Remove a game entirely.
   */
  removeGame(roomId: string): void {
    const game = this.games.get(roomId);
    if (game?.timeoutHandle) {
      clearTimeout(game.timeoutHandle);
    }
    this.games.delete(roomId);
    this.engines.delete(roomId);
  }

  /**
   * Set the timeout handle for the active player's clock.
   */
  setTimeoutHandle(
    roomId: string,
    handle: ReturnType<typeof setTimeout>,
  ): void {
    const game = this.games.get(roomId);
    if (!game) return;
    if (game.timeoutHandle) {
      clearTimeout(game.timeoutHandle);
    }
    game.timeoutHandle = handle;
  }

  /**
   * Find a game by a player's socket ID.
   */
  findGameByPlayer(socketId: string): ChessGameState | undefined {
    for (const game of this.games.values()) {
      if (game.whiteId === socketId || game.blackId === socketId) {
        return game;
      }
    }
    return undefined;
  }

  /**
   * Update a player's socket ID in the game (for reconnection).
   */
  updatePlayerSocket(
    roomId: string,
    oldSocketId: string,
    newSocketId: string,
  ): boolean {
    const game = this.games.get(roomId);
    if (!game) return false;

    if (game.whiteId === oldSocketId) {
      game.whiteId = newSocketId;
      return true;
    }
    if (game.blackId === oldSocketId) {
      game.blackId = newSocketId;
      return true;
    }
    return false;
  }
}
