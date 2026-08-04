"use client";

import { useEffect, useState } from "react";
import { useChessStore } from "@/store/chess/useChessStore";
import { useSocketContext } from "@/context/SocketContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Room } from "@/types/chess.type";

export default function LobbyScreen() {
  const { setPhase, joinRoom } = useChessStore();
  const { socket } = useSocketContext();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    // Ask for the current room list, scoped to chess
    socket.emit("rooms:get", { gameType: "chess" });

    const handleRoomsList = (data: { gameType?: string; rooms: Room[] }) => {
      if (data.gameType && data.gameType !== "chess") return;
      setRooms(data.rooms);
    };

    const handleRoomJoined = (data: { success: boolean; room: Room }) => {
      joinRoom(data.room as any); // RoomInfo vs Room shape — see note below
      setPhase("room"); // explicit here in case joinRoom doesn't already flip phase
    };

    const handleRoomError = (err: { message: string }) => {
      setError(err.message);
    };

    socket.on("rooms:list", handleRoomsList);
    socket.on("room:joined", handleRoomJoined);
    socket.on("room:error", handleRoomError);

    return () => {
      socket.off("rooms:list", handleRoomsList);
      socket.off("room:joined", handleRoomJoined);
      socket.off("room:error", handleRoomError);
    };
  }, [socket, setPhase, joinRoom]);

  function handleJoin(roomId: string) {
    if (!socket) return;
    setError(null);
    socket.emit("room:join", { roomId });
  }

  function handleCreateRoom() {
    if (!socket) return;
    setError(null);
    socket.emit("room:create", { gameType: "chess" });
    // room:created / room:joined response should flip phase — wire a
    // "room:created" listener here too if your backend distinguishes it
    // from room:joined for the creator.
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] p-8 gap-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h2 className="font-outfit text-2xl font-semibold">Lobby</h2>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleCreateRoom}>
            Create Room
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPhase("idle")}>
            ← Back
          </Button>
        </div>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="grid gap-3">
        {rooms.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No rooms yet — create one to get started.
          </p>
        )}
        {rooms.map((room) => (
          <Card key={room.id}>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-outfit">{room.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between pb-4 px-4">
              <span className="font-roboto text-xs text-muted-foreground">
                {room.maxPlayers}/2 players
              </span>
              <Button
                size="sm"
                disabled={room.maxPlayers >= 2}
                onClick={() => handleJoin(room.id)}
              >
                Join
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}