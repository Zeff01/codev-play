"use client";

import { useChessStore } from "@/store/chess/useChessStore";
import { useChessSocket } from "@/hooks/chess/useChessSocket";
import { Button } from "@/components/ui/button";

export default function IdleScreen() {
  useChessSocket();

  const { setPhase, socket } = useChessStore();

  const handleFindGame = () => {
    if (socket) {
      socket.emit("rooms:get", { gameType: "chess" });
    }
    setPhase("lobby");
  };

  const handleCreateRoom = () => {
    if (socket) {
      socket.emit("room:create", { roomName: "Chess Room", gameType: "chess" });
      // Phase transitions to "room" via socket.on("room:created") in socketSlice
    } else {
      setPhase("lobby");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-6 p-8">
      <div className="text-center space-y-2">
        <div className="text-6xl mb-4" aria-hidden="true">♟</div>
        <h1 className="font-outfit text-4xl font-bold tracking-tight">Chess</h1>
        <p className="text-muted-foreground font-roboto text-sm">
          Play chess with your Codev friends.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={handleFindGame}>Find a Game</Button>
        <Button variant="outline" onClick={handleCreateRoom}>Create Room</Button>
      </div>
    </div>
  );
}