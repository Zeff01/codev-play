// Indicator showing whose turn it is

"use client";

import { cn } from "@/lib/utils";
import type { Color, GameStatus } from "@/store/chess/useChessStore";

interface Props {
    activeColor: Color;
    status: GameStatus;
}

export default function TurnIndicator({ activeColor, status }: Props) {
    const isGameActive = status === "playing" || status === "check";

    if (!isGameActive) return <div className="h-8" aria-hidden="true" />;

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card">
            <span
                className={cn(
                    "w-3 h-3 rounded-full border border-border transition-colors duration-300",
                    activeColor === "w" ? "bg-white" : "bg-zinc-900"
                )}
                aria-hidden="true"
            />
            <span className="font-roboto text-xs text-muted-foreground">
                {activeColor === "w" ? "White" : "Black"} to move
            </span>
        </div>
    );
}