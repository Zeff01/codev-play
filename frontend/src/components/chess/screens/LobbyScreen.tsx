"use client";

import { useEffect } from "react";
import { useChessStore } from "@/store/chess/useChessStore";
import { useChessSocket } from "@/hooks/chess/useChessSocket";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Room } from "@/types/chess.type";

export default function LobbyScreen() {
  useChessSocket();

  const { rooms, setPhase, socket } = useChessStore();

  // Fetch rooms on mount
  useEffect(() => {
    if (socket) {
      socket.emit("rooms:get", { gameType: "chess" });
    }
  }, [socket]);

  const handleJoin = (room: Room) => {
    if (socket) {
      socket.emit("room:join", { roomId: room.id });
      // Phase transitions to "room" via socket.on("room:joined") in socketSlice
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] p-8 gap-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h2 className="font-outfit text-2xl font-semibold">Lobby</h2>
        <Button variant="outline" size="sm" onClick={() => setPhase("idle")}>
          ← Back
        </Button>
      </div>

      {rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center py-16">
          <p className="font-roboto text-sm text-muted-foreground">
            No rooms available. Create one from the home screen!
          </p>
          <Button variant="outline" size="sm" onClick={() => setPhase("idle")}>
            ← Back
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {rooms.map((room) => (
            <Card key={room.id}>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-outfit">{room.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between pb-4 px-4">
                <span className="font-roboto text-xs text-muted-foreground">
                  {room.players}/{room.maxPlayers} players · {room.timeControl / 60} min
                </span>
                <Button
                  size="sm"
                  disabled={room.players >= room.maxPlayers}
                  onClick={() => handleJoin(room)}
                >
                  {room.players >= room.maxPlayers ? "Full" : "Join"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}