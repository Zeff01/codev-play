"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { GameStatus, Color } from "@/store/chess/useChessStore";

// Types

interface Props {
  status: GameStatus;
  activeColor: Color;
}

interface AlertConfig {
  variant: "default" | "destructive";
  title: string;
  description: string;
}

// Alert Map

function resolveAlert(status: GameStatus, activeColor: Color): AlertConfig {
  const side = activeColor === "w" ? "White" : "Black";

  switch (status) {
    case "check":
      return {
        variant: "destructive",
        title: "⚠️ Check",
        description: `${side} is in check!`,
      };
    case "checkmate":
      return {
        variant: "destructive",
        title: "Checkmate",
        description: `${side} has been checkmated. Game over.`,
      };
    case "stalemate":
      return {
        variant: "default",
        title: "Stalemate",
        description: "No legal moves — the game is a draw.",
      };
    case "draw":
      return {
        variant: "default",
        title: "Draw",
        description: "The game has ended in a draw.",
      };
    case "resigned":
      return {
        variant: "default",
        title: "Resigned",
        description: `${side} has resigned. Game over.`,
      };
    case "playing":
    default:
      return {
        variant: "default",
        title: "Game in Progress",
        description: `${side} to move.`,
      };
  }
}

// Component

export default function GameAlerts({ status, activeColor }: Props) {
  const config = resolveAlert(status, activeColor);

  return (
    <Alert
      variant={config.variant}
      // Removed the slide-in animation since it's always visible now
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
