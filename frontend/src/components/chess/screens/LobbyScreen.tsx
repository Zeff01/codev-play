"use client";

import { useEffect } from "react";
import { useChessStore } from "@/store/chess/useChessStore";
import { useChessSocket } from "@/hooks/chess/useChessSocket";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LobbyScreen() {
  const { rooms, setPhase } = useChessStore();
  const { getRooms, joinRoomById } = useChessSocket();

  // Fetch rooms on mount and periodically
  useEffect(() => {
    getRooms();
    const interval = setInterval(getRooms, 3000);
    return () => clearInterval(interval);
  }, [getRooms]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] p-8 gap-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h2 className="font-outfit text-2xl font-semibold">Lobby</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={getRooms}>
            ↻ Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPhase("idle")}>
            ← Back
          </Button>
        </div>
      </div>

      {rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <p className="text-muted-foreground font-roboto text-sm">
            No chess rooms available. Create one from the main menu!
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {rooms.map((room) => (
            <Card key={room.id}>
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-outfit flex items-center gap-2">
                  {room.name}
                  <Badge
                    variant={room.players < 2 ? "default" : "secondary"}
                    className="text-[10px] px-1.5 py-0 h-4"
                  >
                    {room.players < 2 ? "Open" : "Full"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between pb-4 px-4">
                <span className="font-roboto text-xs text-muted-foreground">
                  {room.players}/{room.maxPlayers} players ·{" "}
                  {room.timeControl / 60} min
                </span>
                <Button
                  size="sm"
                  disabled={room.players >= 2}
                  onClick={() => joinRoomById(room.id)}
                >
                  Join
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
