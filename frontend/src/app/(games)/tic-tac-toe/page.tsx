"use client";

import { useSocketContext } from "@/context/SocketContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateRoom } from "@/components/tic-tac-toe";
import { Button } from "@/components/ui/button";

export default function TicTacToePage() {
  const { socket, rooms } = useSocketContext();

  const createRoom = async (roomName: string) => {
    socket?.emit("room:create", { roomName });
  };

  const joinRoom = async (roomId: string) => {
    socket?.emit("room:join", { roomId });
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 gap-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Tic Tac Toe</h1>
        <p className="text-muted-foreground">Create a room to start playing</p>
      </div>

      <div className="flex gap-4">
        <CreateRoom onCreateRoom={createRoom} />
      </div>

      <div className="w-full">
        <h2 className="text-2xl font-semibold mb-4">Active Rooms</h2>
        {rooms.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No active rooms. Create one to start playing!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <Card key={room.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {room.name}
                    <Badge variant={room.playerCount >= 2 ? "secondary" : "default"}>
                      {room.playerCount}/2 Players
                    </Badge>
                  </CardTitle>
                  <CardDescription>Room ID: {room.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Created {new Date(room.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <span className="mt-2 block text-right">
                    {room.playerCount >= 2 ? (
                      <Button variant="outline" onClick={() => startGame(room.id)}>
                        Start Game
                      </Button>
                    ) : (
                      <Button variant="outline" onClick={() => joinRoom(room.id)}>
                        Join Room
                      </Button>
                    )}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
