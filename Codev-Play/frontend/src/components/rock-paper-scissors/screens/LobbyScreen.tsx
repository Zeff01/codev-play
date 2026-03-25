"use client";

import { useEffect, useState } from "react";
import { useRpsStore } from "@/store/rps/useRpsStore";
import { useSocketContext } from "@/context/SocketContext";
import { ArrowLeft } from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LobbyScreen() {
    const [roomName, setRoomName] = useState("");
    const { rooms, getRooms, createRoom, joinRoom, reset, setSocket } =
        useRpsStore();
    const { socket, isConnected } = useSocketContext();

    useEffect(() => {
        if (socket && isConnected) {
            setSocket(socket);
            getRooms();
        }
    }, [socket, isConnected, setSocket, getRooms]);

    return (
        <main className="min-h-screen flex items-start justify-center p-6 bg-background">
            <Card className="w-full max-w-7xl">
                <div className="p-4 pb-0">
                    <Button
                        onClick={reset}
                        variant="secondary"
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                </div>
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl">Online Lobby</CardTitle>
                    <CardDescription>
                        Create a room or join an existing match
                    </CardDescription>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Input
                            placeholder="Enter room name..."
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            className="w-64"
                        />

                        <Button
                            onClick={() => {
                                createRoom(roomName);
                                setRoomName("");
                            }}
                            size="lg"
                            disabled={!roomName.trim()}
                        >
                            Create Room
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <section>
                        <h2 className="text-lg font-semibold mb-4">
                            Available Rooms
                        </h2>

                        {rooms.length === 0 ? (
                            <p className="text-muted-foreground text-center py-8">
                                No rooms available
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {rooms.map((room) => (
                                    <Card key={room.id}>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base">
                                                Room {room.name}
                                            </CardTitle>
                                            <CardDescription>
                                                {room.players}/2 players
                                            </CardDescription>
                                        </CardHeader>

                                        <CardFooter className="flex justify-end">
                                            <Button
                                                onClick={() =>
                                                    joinRoom(room.id)
                                                }
                                                disabled={room.players >= 2}
                                                variant={
                                                    room.players >= 2
                                                        ? "secondary"
                                                        : "default"
                                                }
                                            >
                                                {room.players >= 2
                                                    ? "Full"
                                                    : "Join"}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </section>
                </CardContent>
            </Card>
        </main>
    );
}
