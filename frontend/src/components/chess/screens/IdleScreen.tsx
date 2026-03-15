"use client";

import { useChessStore } from "@/store/chess/useChessStore";
import { Button } from "@/components/ui/button";

export default function IdleScreen() {
    const setPhase = useChessStore((s) => s.setPhase);

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

                {/* TODO: [F503 - Create game lobby] emit("chess:getRooms") via socket before navigating */}
                <Button onClick={() => setPhase("lobby")}>Find a Game</Button>

                {/* TODO: [F503 - Create game lobby] emit("chess:createRoom", { timeControl: 600 }) via socket */}
                <Button variant="outline" onClick={() => setPhase("lobby")}>
                    Create Room
                </Button>

            </div>
        </div>
    );
}