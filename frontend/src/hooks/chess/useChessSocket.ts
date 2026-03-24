"use client";

import { useEffect, useCallback, useRef } from "react";
import { useSocketContext } from "@/context/SocketContext";
import { useChessStore } from "@/store/chess/useChessStore";
import type { Color, GameStatus, Room } from "@/store/chess/chess.types";

/**
 * useChessSocket — Bridge between SocketContext and useChessStore.
 *
 * Lifecycle:
 *   1. On mount → get socket from useSocketContext()
 *   2. Register ALL chess:* listeners
 *   3. Each listener calls the appropriate useChessStore action
 *   4. On unmount → .off() all listeners
 *
 * Returns: emit wrappers that components can call.
 */
export function useChessSocket() {
  const { socket } = useSocketContext();
  const registeredRef = useRef(false);

  const {
    setPhase,
    setRooms,
    joinRoom,
    startGame,
    applyServerMove,
    syncClocks,
    setValidation,
    setRoomId,
    setPlayerId,
    setOpponentId,
    setOnline,
    setConnected,
    setOpponentConnected,
    setDrawOffer,
    setRematchRequest,
    endGame,
    reset,
  } = useChessStore();

  // ── Register socket listeners ──
  useEffect(() => {
    if (!socket || registeredRef.current) return;
    registeredRef.current = true;

    // Connection status
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    // ── Room events ──

    socket.on(
      "chess:roomList",
      (rooms: Array<{
        id: string;
        name: string;
        playerCount: number;
        players: string[];
        timeControl: number;
        status: string;
      }>) => {
        const mapped: Room[] = rooms.map((r) => ({
          id: r.id,
          name: r.name,
          players: r.playerCount,
          maxPlayers: 2 as const,
          timeControl: r.timeControl,
        }));
        setRooms(mapped);
      },
    );

    socket.on(
      "chess:roomCreated",
      (data: { success: boolean; room: any }) => {
        if (data.success) {
          const r = data.room;
          setRoomId(r.id);
          joinRoom({
            id: r.id,
            name: r.name,
            players: r.playerCount,
            maxPlayers: 2,
            timeControl: r.timeControl,
          });
        }
      },
    );

    socket.on(
      "chess:roomJoined",
      (data: { success: boolean; room: any }) => {
        if (data.success) {
          const r = data.room;
          setRoomId(r.id);
          joinRoom({
            id: r.id,
            name: r.name,
            players: r.playerCount,
            maxPlayers: 2,
            timeControl: r.timeControl,
          });

          // Identify the other player already in the room as our opponent
          const otherPlayer = r.players?.find(
            (id: string) => id !== socket.id,
          );
          if (otherPlayer) {
            setOpponentId(otherPlayer);
          }
        }
      },
    );

    socket.on(
      "chess:playerJoined",
      (data: { playerId: string; room: any }) => {
        setOpponentId(data.playerId);
        // Update room info
        const r = data.room;
        if (r) {
          joinRoom({
            id: r.id,
            name: r.name,
            players: r.playerCount,
            maxPlayers: 2,
            timeControl: r.timeControl,
          });
        }
      },
    );

    socket.on("chess:playerLeft", (data: { playerId: string }) => {
      setOpponentId(null);
    });

    // ── Game events ──

    socket.on(
      "chess:gameStart",
      (data: {
        roomId: string;
        whiteId: string;
        blackId: string;
        fen: string;
        timeControl: number;
      }) => {
        const myColor: Color =
          socket.id === data.whiteId ? "w" : "b";
        const opponentSocketId =
          socket.id === data.whiteId ? data.blackId : data.whiteId;

        setPlayerId(socket.id!);
        setOpponentId(opponentSocketId);
        setOnline(true);
        setOpponentConnected(true);
        startGame(myColor, data.timeControl);
      },
    );

    socket.on(
      "chess:moveMade",
      (data: {
        fen: string;
        san: string;
        color: Color;
        from: string;
        to: string;
        promotion?: string | null;
        status: GameStatus;
        clocks: { w: number; b: number };
      }) => {
        applyServerMove(data.fen, data.san, data.color, data.status);
        syncClocks(data.clocks);
      },
    );

    socket.on(
      "chess:invalidMove",
      (data: { message: string }) => {
        setValidation({ valid: false, reason: data.message });
      },
    );

    socket.on(
      "chess:drawOffered",
      (data: { offeredBy: string }) => {
        setDrawOffer(data.offeredBy);
      },
    );

    socket.on(
      "chess:drawResponse",
      (data: { accepted: boolean }) => {
        setDrawOffer(null);
        if (data.accepted) {
          endGame("draw");
        }
      },
    );

    socket.on(
      "chess:gameOver",
      (data: {
        status: GameStatus;
        winner: Color | null;
        reason: string;
      }) => {
        endGame(data.status);
      },
    );

    socket.on(
      "chess:opponentDisconnected",
      (data: { playerId: string; timeoutSeconds: number }) => {
        setOpponentConnected(false);
      },
    );

    socket.on(
      "chess:opponentReconnected",
      (data: { playerId: string }) => {
        setOpponentConnected(true);
      },
    );

    socket.on(
      "chess:rematchRequested",
      (data: { requestedBy: string }) => {
        setRematchRequest(data.requestedBy);
      },
    );

    socket.on(
      "chess:rematchResponse",
      (data: { accepted: boolean }) => {
        setRematchRequest(null);
        if (!data.accepted) {
          // Opponent declined — stay on game over screen
        }
        // If accepted, chess:gameStart will fire next
      },
    );

    socket.on(
      "chess:clockUpdate",
      (data: { clocks: { w: number; b: number }; activeColor: Color }) => {
        syncClocks(data.clocks);
      },
    );

    socket.on(
      "chess:error",
      (data: { message: string }) => {
        console.error("[Chess Socket] Error:", data.message);
      },
    );

    // ── Cleanup ──
    return () => {
      registeredRef.current = false;
      socket.off("chess:roomList");
      socket.off("chess:roomCreated");
      socket.off("chess:roomJoined");
      socket.off("chess:playerJoined");
      socket.off("chess:playerLeft");
      socket.off("chess:gameStart");
      socket.off("chess:moveMade");
      socket.off("chess:invalidMove");
      socket.off("chess:drawOffered");
      socket.off("chess:drawResponse");
      socket.off("chess:gameOver");
      socket.off("chess:opponentDisconnected");
      socket.off("chess:opponentReconnected");
      socket.off("chess:rematchRequested");
      socket.off("chess:rematchResponse");
      socket.off("chess:clockUpdate");
      socket.off("chess:error");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  // ── Emit wrappers ──

  const createRoom = useCallback(
    (timeControl: number = 600, roomName?: string) => {
      socket?.emit("chess:createRoom", { timeControl, roomName });
    },
    [socket],
  );

  const getRooms = useCallback(() => {
    socket?.emit("chess:getRooms");
  }, [socket]);

  const joinRoomById = useCallback(
    (roomId: string) => {
      socket?.emit("chess:joinRoom", { roomId });
    },
    [socket],
  );

  const leaveRoom = useCallback(
    (roomId: string) => {
      socket?.emit("chess:leaveRoom", { roomId });
    },
    [socket],
  );

  const ready = useCallback(
    (roomId: string) => {
      socket?.emit("chess:ready", { roomId });
    },
    [socket],
  );

  const sendMove = useCallback(
    (roomId: string, from: string, to: string, promotion?: string) => {
      socket?.emit("chess:move", { roomId, from, to, promotion });
    },
    [socket],
  );

  const offerDraw = useCallback(
    (roomId: string) => {
      socket?.emit("chess:offerDraw", { roomId });
    },
    [socket],
  );

  const respondDraw = useCallback(
    (roomId: string, accept: boolean) => {
      socket?.emit("chess:respondDraw", { roomId, accept });
    },
    [socket],
  );

  const resign = useCallback(
    (roomId: string) => {
      socket?.emit("chess:resign", { roomId });
    },
    [socket],
  );

  const requestRematch = useCallback(
    (roomId: string) => {
      socket?.emit("chess:requestRematch", { roomId });
    },
    [socket],
  );

  const respondRematch = useCallback(
    (roomId: string, accept: boolean) => {
      socket?.emit("chess:respondRematch", { roomId, accept });
    },
    [socket],
  );

  const requestClockSync = useCallback(
    (roomId: string) => {
      socket?.emit("chess:clockSync", { roomId });
    },
    [socket],
  );

  return {
    createRoom,
    getRooms,
    joinRoomById,
    leaveRoom,
    ready,
    sendMove,
    offerDraw,
    respondDraw,
    resign,
    requestRematch,
    respondRematch,
    requestClockSync,
  };
}
