"use client";

import { useChessStore } from "@/store/chess/useChessStore";
import { Button } from "@/components/ui/button";

export default function RoomScreen() {
    const { currentRoom, leaveRoom, startGame } = useChessStore();

    // TODO: listen for socket event "chess:gameStart" → startGame(color, timeControl)
    // Remove [Dev] Start as White button when socket is wired
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-6 p-8">
            <div className="text-center space-y-2">
                <h2 className="font-outfit text-2xl font-semibold">
                    {currentRoom?.name ?? "Room"}
                </h2>
                <p className="font-roboto text-sm text-muted-foreground">
                    Waiting for an opponent…
                </p>
            </div>

            {/* Dev shortcut — remove before merging */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => startGame("w", currentRoom?.timeControl ?? 600)}
            >
                [Dev] Start as White
            </Button>

            <Button variant="ghost" size="sm" onClick={leaveRoom}>
                Leave Room
            </Button>
        </div>
    );
}