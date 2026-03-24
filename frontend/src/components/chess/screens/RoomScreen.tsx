"use client";

import { useChessStore } from "@/store/chess/useChessStore";
import { useChessSocket } from "@/hooks/chess/useChessSocket";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function RoomScreen() {
  const { currentRoom, roomId, opponentId, leaveRoom: storeLeaveRoom, startGame } =
    useChessStore();
  const { ready, leaveRoom: socketLeaveRoom } = useChessSocket();

  const activeRoomId = roomId || currentRoom?.id;
  const hasOpponent = !!opponentId;

  const handleReady = () => {
    if (activeRoomId) {
      ready(activeRoomId);
    }
  };

  const handleLeave = () => {
    if (activeRoomId) {
      socketLeaveRoom(activeRoomId);
    }
    storeLeaveRoom();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-6 p-8">
      <div className="text-center space-y-2">
        <h2 className="font-outfit text-2xl font-semibold">
          {currentRoom?.name ?? "Room"}
        </h2>
        <p className="font-roboto text-sm text-muted-foreground">
          {hasOpponent
            ? "Opponent joined! Press Ready to start."
            : "Waiting for an opponent…"}
        </p>
        {currentRoom && (
          <Badge variant="outline" className="font-mono text-xs">
            {currentRoom.timeControl / 60} min · Room {activeRoomId}
          </Badge>
        )}
      </div>

      {/* Player status indicators */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <span className="font-roboto text-sm">You</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              hasOpponent
                ? "bg-green-500 animate-pulse"
                : "bg-muted-foreground/30"
            }`}
          />
          <span className="font-roboto text-sm text-muted-foreground">
            {hasOpponent ? "Opponent" : "Waiting..."}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-48">
        <Button
          onClick={handleReady}
          disabled={!hasOpponent}
          className="font-outfit font-semibold"
        >
          ✓ Ready
        </Button>

        {/* Dev shortcut — local play without server */}
        <Button
          variant="outline"
          size="sm"
          className="text-xs opacity-60"
          onClick={() => startGame("w", currentRoom?.timeControl ?? 600)}
        >
          [Dev] Start Local Game
        </Button>

        <Button variant="ghost" size="sm" onClick={handleLeave}>
          Leave Room
        </Button>
      </div>
    </div>
  );
}
