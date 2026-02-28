"use client";

import { useRpsStore } from "@/store/useRpsStore";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DoorOpen, Play } from "lucide-react";

export default function RoomScreen() {
    const { roomId, isHost, startMatch, leaveRoom } = useRpsStore();

    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
            <Card className="w-full max-w-md shadow-xl dark:bg-[#282357] dark:border-purple-400/30">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl">Room</CardTitle>
                    <CardDescription>Waiting lobby</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 text-center">
                    <div>
                        <p className="text-lg font-semibold">
                            Room ID: {roomId}
                        </p>

                        <p className="text-sm text-muted-foreground dark:text-purple-200 mt-2">
                            {isHost
                                ? "Waiting for opponent to join..."
                                : "Waiting for host to start game..."}
                        </p>
                    </div>

                    {isHost && (
                        <Button
                            onClick={startMatch}
                            className="w-full font-semibold"
                        >
                            <Play className="mr-2 h-4 w-4" />
                            Start Game
                        </Button>
                    )}
                </CardContent>

                <CardFooter>
                    <Button
                        onClick={leaveRoom}
                        variant="secondary"
                        className="w-full"
                    >
                        <DoorOpen className="mr-2 h-4 w-4" />
                        Leave Room
                    </Button>
                </CardFooter>
            </Card>
        </main>
    );
}
