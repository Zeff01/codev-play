"use client";

import { useChessStore } from "@/store/chess/useChessStore";
import { useChessSocket } from "@/hooks/chess/useChessSocket";
import { Button } from "@/components/ui/button";

export default function RoomScreen() {
  useChessSocket();

  const { currentRoom, leaveRoom, socket } = useChessStore();

  // Game starts via socket.on("chess:gameStart") in socketSlice

  const handleLeave = () => {
    if (socket && currentRoom) {
      socket.emit("room:leave", { roomId: currentRoom.id });
    }
    leaveRoom();
  };

  const handleStart = () => {
    if (socket && currentRoom) {
      socket.emit("room:start", { roomId: currentRoom.id });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-6 p-8">
      <div className="text-center space-y-2">
        <h2 className="font-outfit text-2xl font-semibold">
          {currentRoom?.name ?? "Room"}
        </h2>
        <p className="font-roboto text-sm text-muted-foreground">
          {currentRoom?.players === 2 ? "Both players ready!" : "Waiting for an opponent…"}
        </p>
        <p className="font-mono text-xs text-muted-foreground/60">
          {currentRoom?.players ?? 1}/2 players · {(currentRoom?.timeControl ?? 600) / 60} min
        </p>
      </div>

      {currentRoom?.players === 2 && (
        <Button onClick={handleStart}>Start Game</Button>
      )}

      <Button variant="ghost" size="sm" onClick={handleLeave}>
        Leave Room
      </Button>
    </div>
  );
}