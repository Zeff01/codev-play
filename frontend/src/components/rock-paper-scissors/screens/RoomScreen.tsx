"use client";

import { useRouter } from "next/navigation";
import { useRpsStore } from "@/store/rps/useRpsStore";
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
    const router = useRouter();

    const { roomId, roomName, isHost, hasOpponent, startMatch, leaveRoom } =
        useRpsStore();

    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
            <Card className="w-full max-w-md shadow-xl dark:bg-[#282357] dark:border-purple-400/30">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl">Room</CardTitle>
                    <CardDescription>Waiting lobby</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 text-center">
                    <div>
                        <p className="text-lg font-semibold">{roomName}</p>

                        <p className="text-sm text-muted-foreground">
                            ID: {roomId}
                        </p>

                        <p className="text-sm text-muted-foreground dark:text-purple-200 mt-2">
                            {isHost
                                ? hasOpponent
                                    ? "Opponent joined – you can start the game"
                                    : "Waiting for opponent to join..."
                                : "Waiting for host to start game..."}
                        </p>
                    </div>

                    {isHost && (
                        <Button
                            onClick={() => {
                                startMatch();
                                if (roomId) {
                                    router.push(`/rps/game/${roomId}`);
                                }
                            }}
                            className="w-full font-semibold"
                            disabled={!hasOpponent}
                        >
                            <Play className="mr-2 h-4 w-4" />
                            Start Game
                        </Button>
                    )}
                </CardContent>

                <CardFooter>
                    <Button
                        onClick={() => {
                            leaveRoom();
                            router.push("/rps/lobby");
                        }}
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
