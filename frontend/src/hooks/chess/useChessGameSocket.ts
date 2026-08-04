"use client";

import { useEffect, useRef } from "react";
import { useChessStore } from "@/store/chess/useChessStore";
import { useSocketContext } from "@/context/SocketContext";
import type { ChessData } from "@/types/chess.type";
import { useAuth } from "@/context/AuthContext";

export function useChessGameSocket(gameId: string | null) {
  const { socket } = useSocketContext();
  const setSocket = useChessStore((s) => s.setSocket);
  const setGameId = useChessStore((s) => s.setGameId);
  const applyServerMove = useChessStore((s) => s.applyServerMove);
  const endGame = useChessStore((s) => s.endGame);
  const setShowDrawModal = useChessStore((s) => s.setShowDrawModal);
  const { user } = useAuth();

  // Bridge the SocketContext connection into the Zustand store
  useEffect(() => {
    if (socket) setSocket(socket);
  }, [socket, setSocket]);

  // Join the game room + register listeners, once we have both a socket and a gameId
  const hasJoinedGameId = useRef<string | null>(null);

  useEffect(() => {
    if (!socket || !gameId) return;

    setGameId(gameId);

    if (hasJoinedGameId.current !== gameId) {
      // "game:reconnect" does everything "game:join" did (joins the socket
      // room) PLUS cancels the chess forfeit-on-disconnect timer and sends
      // back the full current game state via "game:restore" — so it's safe
      // to use for both a brand-new join and a post-refresh reconnect.
      socket.emit("game:reconnect", { gameId, gameType: "chess" });
      hasJoinedGameId.current = gameId;
    }

    const handleJoined = (data: { success: boolean; gameId: string }) => {
      console.log("Joined game:", data);
    };

    const handleMove = (payload: { gameType: string; game: ChessData }) => {
      if (payload.gameType !== "chess") return;
      const game = payload.game;
      const lastMove = game.pgn_data
        ? game.pgn_data.trim().split(/\s+/).pop()
        : undefined;

      applyServerMove(
        game.fen_position,
        lastMove ?? "",
        game.current_turn === "w" ? "b" : "w", // the color that just moved
        mapStatus(game.status),
      );
    };

    const handleGameEnd = (payload: { status: string; winner: string | null; game: ChessData }) => {
      endGame(mapStatus(payload.status));
    };

    const handleError = (err: { message: string }) => {
      console.error("Game socket error:", err.message);
    };

    const handleRestore = (data: { game: ChessData }) => {
      const game = data.game;
      if (game.status !== "playing") {
        localStorage.removeItem("chess_gameId");
        useChessStore.setState({ phase: "idle", gameId: null });
        return;
      }
      const myId = Number(user?.id);
      const restoredColor = game.white_player_id === myId ? "w" : "b";

      useChessStore.setState({
        position: game.fen_position,
        activeColor: game.current_turn,
        status: mapStatus(game.status),
        clocks: { w: game.white_time_left, b: game.black_time_left },
        playerColor: restoredColor,
      });
    };

    // Sibling function, not nested inside handleRestore — this was the bug.
    const handleDraw = (payload: {
      drawStatus: string;
      offeredBy: number;
      game: ChessData;
    }) => {
      if (payload.drawStatus === "offered" || payload.drawStatus === "pending") {
        const myId = Number(user?.id);
        if (payload.offeredBy !== myId) {
          // Only the RECEIVING player should see the modal
          setShowDrawModal(true);
        }
        return;
      }

      if (payload.drawStatus === "accepted") {
        endGame("draw");
        setShowDrawModal(false);
        return;
      }

      if (payload.drawStatus === "declined" || payload.drawStatus === "rejected") {
        setShowDrawModal(false);
      }
    };

    socket.on("game:joined", handleJoined);
    socket.on("game:move", handleMove);
    socket.on("game:error", handleError);
    socket.on("chess:end", handleGameEnd);
    socket.on("game:result", handleGameEnd);
    socket.on("game:restore", handleRestore);
    socket.on("chess:draw", handleDraw);

    return () => {
      socket.off("game:joined", handleJoined);
      socket.off("game:move", handleMove);
      socket.off("game:error", handleError);
      socket.off("chess:end", handleGameEnd);
      socket.off("game:result", handleGameEnd);
      socket.off("game:restore", handleRestore);
      socket.off("chess:draw", handleDraw);
    };
  }, [socket, gameId, setGameId, applyServerMove, endGame, setShowDrawModal, user?.id]);
}

// Maps your backend's status/reason strings to the frontend's GameStatus union.
// Adjust this mapping to match your actual GameStatus type + backend `status`/`reason` values.
function mapStatus(status: string): any {
  return status; // if the strings already line up 1:1, this is a no-op — tighten if not
}