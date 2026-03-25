"use client";

import { useEffect, useState } from "react";
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
    transient: boolean; // auto-dismiss after 3 s if true
}

// Alert Map

function resolveAlert(status: GameStatus, activeColor: Color): AlertConfig | null {
    const side = activeColor === "w" ? "White" : "Black";

    switch (status) {
        case "check":
            return {
                variant: "destructive",
                title: "Check",
                description: `${side} is in check.`,
                transient: true,
            };
        case "checkmate":
            return {
                variant: "destructive",
                title: "Checkmate",
                description: `${side} has been checkmated. Game over.`,
                transient: false,
            };
        case "stalemate":
            return {
                variant: "default",
                title: "Stalemate",
                description: "No legal moves — the game is a draw.",
                transient: false,
            };
        case "draw":
            return {
                variant: "default",
                title: "Draw",
                description: "The game has ended in a draw.",
                transient: false,
            };
        case "resigned":
            return {
                variant: "default",
                title: "Resigned",
                description: `${side} has resigned. Game over.`,
                transient: false,
            };
        default:
            return null;
    }
}

// Component

export default function GameAlerts({ status, activeColor }: Props) {
    const [dismissed, setDismissed] = useState(false);
    const [prevStatus, setPrevStatus] = useState(status);

    // Reset on every status change
    useEffect(() => {
        if (status !== prevStatus) {
            setDismissed(false);
            setPrevStatus(status);
        }
    }, [status, prevStatus]);

    const config = resolveAlert(status, activeColor);

    // Auto-dismiss transient alerts (check)
    useEffect(() => {
        if (!config?.transient) return;
        const t = setTimeout(() => setDismissed(true), 3000);
        return () => clearTimeout(t);
    }, [config]);

    if (!config || dismissed) return null;

    return (
        <Alert
            variant={config.variant}
            className="w-full max-w-md font-roboto animate-in fade-in slide-in-from-top-2 duration-200"
        >
            <AlertTitle className="font-outfit text-sm">{config.title}</AlertTitle>
            <AlertDescription className="text-xs">{config.description}</AlertDescription>
        </Alert>
    );
}