"use client";

import { useChessStore } from "@/store/chess/useChessStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LobbyScreen() {
    const { rooms, joinRoom, setPhase } = useChessStore();

    // TODO: on mount emit("chess:getRooms") and listen for chess:rooms event → setRooms()

    const displayRooms = rooms.length > 0 ? rooms : [
        { id: "1", name: "Room #1", players: 1, maxPlayers: 2 as const, timeControl: 600 },
        { id: "2", name: "Room #2", players: 0, maxPlayers: 2 as const, timeControl: 300 },
    ];

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)] p-8 gap-6 max-w-2xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <h2 className="font-outfit text-2xl font-semibold">Lobby</h2>
                <Button variant="outline" size="sm" onClick={() => setPhase("idle")}>
                    ← Back
                </Button>
            </div>
            <div className="grid gap-3">
                {displayRooms.map((room) => (
                    <Card key={room.id}>
                        <CardHeader className="pb-2 pt-4 px-4">
                            <CardTitle className="text-sm font-outfit">{room.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between pb-4 px-4">
                            <span className="font-roboto text-xs text-muted-foreground">
                                {room.players}/{room.maxPlayers} players · {room.timeControl / 60} min
                            </span>
                            <Button size="sm" onClick={() => joinRoom(room)}>
                                Join
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}