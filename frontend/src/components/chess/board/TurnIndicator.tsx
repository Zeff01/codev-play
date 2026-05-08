"use client";

import { cn } from "@/lib/utils";
import type { Color, GameStatus } from "@/types/chess.type";

interface Props {
  activeColor: Color;
  status: GameStatus;
}

export default function TurnIndicator({ activeColor, status }: Props) {
  const isActive =
    status !== "checkmate" &&
    status !== "stalemate" &&
    status !== "draw" &&
    status !== "resigned";

  if (!isActive) {
    return (
      <div className="h-8 flex items-center text-xs text-muted-foreground">
        Game ended
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card">
      <span
        className={cn(
          "w-3 h-3 rounded-full border border-border",
          activeColor === "w" ? "bg-white" : "bg-zinc-900"
        )}
      />
      <span className="text-xs text-muted-foreground">
        {activeColor === "w" ? "White" : "Black"} to move
      </span>
    </div>
  );
}