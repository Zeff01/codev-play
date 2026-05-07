"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { GameStatus, Color } from "@/types/chess.type";

// Types

interface Props {
  status: GameStatus;
  activeColor: Color;      // player viewing the board
  winner?: Color | null;   // NEW: actual winner from backend
}

interface AlertConfig {
  variant: "default" | "destructive";
  title: string;
  description: string;
}

// Core logic

function resolveAlert(
  status: GameStatus,
  activeColor: Color,
  winner?: Color | null
): AlertConfig {
  const isPlayerWinner = winner ? winner === activeColor : null;

  switch (status) {
    case "check":
      return {
        variant: "destructive",
        title: "⚠️ Check",
        description: "Your king is in check!",
      };

    case "checkmate":
      return {
        variant: "destructive",
        title: "Checkmate",
        description:
          winner === null
            ? "Game over by checkmate."
            : isPlayerWinner
              ? "You won by checkmate!"
              : "You have been checkmated.",
      };

    case "stalemate":
      return {
        variant: "default",
        title: "Stalemate",
        description: "No legal moves available — draw.",
      };

    case "draw":
      return {
        variant: "default",
        title: "Draw",
        description: "The game ended in a draw.",
      };

    case "resigned":
      return {
        variant: "default",
        title: "Resignation",
        description: isPlayerWinner
          ? "Opponent resigned. You win!"
          : "You resigned. Game over.",
      };

    case "playing":
    default:
      return {
        variant: "default",
        title: "Game in Progress",
        description: "Your turn to play.",
      };
  }
}

// Component

export default function GameAlerts({
  status,
  activeColor,
  winner = null,
}: Props) {
  const config = resolveAlert(status, activeColor, winner);

  return (
    <Alert
      variant={config.variant}
      className="w-full bg-card shadow-sm transition-colors duration-300"
    >
      <AlertTitle className="font-outfit text-sm font-bold tracking-wide">
        {config.title}
      </AlertTitle>
      <AlertDescription className="text-xs text-muted-foreground">
        {config.description}
      </AlertDescription>
    </Alert>
  );
}