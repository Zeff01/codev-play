"use client";

import { useEffect } from "react";
import { useChessStore } from "@/store/chess/useChessStore";
import { useSocketContext } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import type { ChessData } from "@/types/chess.type";

export default function RoomScreen() {
  const { currentRoom, leaveRoom, joinRoom, startGame, setGameId } = useChessStore();
  const { socket } = useSocketContext();
  const { user } = useAuth();

  useEffect(() => {
    if (!socket) return;

    const handlePlayerJoined = (data: { playerId: string; room: any }) => {
      joinRoom(data.room as any); // refresh currentRoom with the latest playerCount
    };

    socket.on("player:joined", handlePlayerJoined);

    return () => {
      socket.off("player:joined", handlePlayerJoined);
    };
  }, [socket, joinRoom]);

  useEffect(() => {
    if (!socket) return;

    const handleMatchStarted = (payload: {
      gameType: string;
      gameId: string | number;
      game: ChessData;
    }) => {
      if (payload.gameType !== "chess") return;

      setGameId(String(payload.gameId));

      const myColor =
        payload.game.white_player_id === Number(user?.id) ? "w" : "b";

      const [baseMinutes] = payload.game.time_control.split("+").map(Number);
      const timeControlSeconds = baseMinutes * 60;

      startGame(myColor, timeControlSeconds);
    };

    socket.on("match:started", handleMatchStarted);

    return () => {
      socket.off("match:started", handleMatchStarted);
    };
  }, [socket, startGame, setGameId, user?.id]);

  function handleStartMatch() {
    if (!socket || !currentRoom) return;
    socket.emit("room:start", { roomId: currentRoom.id });
  }

  // Room type from RoomManager uses players: Set<string> on the backend,
  // but your frontend's Room type may differ — adjust playerCount access
  // to however `currentRoom` actually represents player count on your side.
  const playerCount =
    (currentRoom as any)?.playerCount ??
    (currentRoom as any)?.players?.length ??
    0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-6 p-8">
      <div className="text-center space-y-2">
        <h2 className="font-outfit text-2xl font-semibold">
          {currentRoom?.name ?? "Room"}
        </h2>
        <p className="font-roboto text-sm text-muted-foreground">
          {playerCount >= 2
            ? "Ready to start!"
            : "Waiting for an opponent…"}
        </p>
      </div>

      <Button
        variant="default"
        size="sm"
        disabled={playerCount < 2}
        onClick={handleStartMatch}
      >
        Start Match
      </Button>

      <Button variant="ghost" size="sm" onClick={leaveRoom}>
        Leave Room
      </Button>
    </div>
  );
}