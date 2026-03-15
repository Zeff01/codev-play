"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Types

interface Props {
    timeLeft: number;       // seconds remaining
    isActive: boolean;
    onTick?: () => void;    // parent owns state; called each second
    onExpire?: () => void;
}

// Helpers

function formatTime(seconds: number): string {
    const s = Math.max(0, Math.floor(seconds));
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

// Component

export default function GameClock({ timeLeft, isActive, onTick, onExpire }: Props) {
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!isActive) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        intervalRef.current = setInterval(() => {
            if (timeLeft <= 1) {
                clearInterval(intervalRef.current!);
                onTick?.();
                onExpire?.();
            } else {
                onTick?.();
            }
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, timeLeft, onTick, onExpire]);

    const isCritical = timeLeft <= 10;
    const isLow = timeLeft <= 30 && !isCritical;

    return (
        <div
            aria-label={`Clock: ${formatTime(timeLeft)}`}
            aria-live={isCritical ? "assertive" : "off"}
            className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg border transition-all duration-200",
                isActive
                    ? "border-border bg-card"
                    : "border-border/50 bg-card/50",
                isCritical && "border-destructive/60 bg-destructive/5 animate-pulse"
            )}
        >
            {/* Active indicator */}
            <span
                className={cn(
                    "w-1.5 h-1.5 rounded-full transition-colors",
                    isActive ? "bg-primary animate-[ping_1s_ease-in-out_infinite]" : "bg-muted"
                )}
                aria-hidden="true"
            />

            {/* Time display */}
            <span
                className={cn(
                    "font-mono text-xl font-medium tabular-nums tracking-tight transition-colors",
                    !isActive && "text-muted-foreground",
                    isActive && !isLow && !isCritical && "text-foreground",
                    isLow && "text-yellow-500 dark:text-yellow-400",
                    isCritical && "text-destructive"
                )}
            >
                {formatTime(timeLeft)}
            </span>

            {/* Center Time */}
            <span className="w-1.5" aria-hidden="true" />
        </div>
    );
}