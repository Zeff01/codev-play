"use client";

import {
    FaRegHandRock,
    FaRegHandPaper,
    FaRegHandScissors,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Choice, GamePhase, Round, RoundResult } from "@/types/rps";

const ICONS: Record<Choice, React.ReactNode> = {
    rock: <FaRegHandRock className="w-12 h-12" />,
    paper: <FaRegHandPaper className="w-12 h-12" />,
    scissors: <FaRegHandScissors className="w-12 h-12" />,
};

const RESULT_CONFIG: Record<
    RoundResult,
    { label: string; color: string; glow: string }
> = {
    win: {
        label: "You Win!",
        color: "text-emerald-500",
        glow: "shadow-[0_0_18px_rgba(16,185,129,0.6)]",
    },
    lose: {
        label: "You Lose",
        color: "text-rose-500",
        glow: "shadow-[0_0_18px_rgba(244,63,94,0.6)]",
    },
    draw: {
        label: "Draw!",
        color: "text-amber-500",
        glow: "shadow-[0_0_18px_rgba(245,158,11,0.6)]",
    },
};

type Props = {
    phase: GamePhase;
    currentRound: Round | null;
    winnerId: "player" | "opponent" | null;
    onNextRound: () => void;
    onReset: () => void;
    bestOf: number;
    mode: "vs-cpu" | "online" | null;
};

export default function ResultDisplay({
    phase,
    currentRound,
    winnerId,
    onNextRound,
    onReset,
    bestOf,
    mode,
}: Props) {
    const router = useRouter();

    if (phase === "revealing") {
        return (
            <CenteredContainer>
                <LoadingDots />
                <p className="text-sm uppercase tracking-widest text-muted-foreground dark:text-purple-300">
                    {mode === "online"
                        ? "Waiting for opponent…"
                        : "CPU is choosing…"}
                </p>
            </CenteredContainer>
        );
    }

    if (phase === "idle" || phase === "choosing" || !currentRound) {
        return (
            <CenteredContainer>
                <p className="text-lg tracking-wide text-muted-foreground dark:text-purple-300">
                    Choose your move
                </p>
            </CenteredContainer>
        );
    }

    if (phase === "game-over") {
        const playerWon = winnerId === "player";

        return (
            <CenteredContainer animate>
                <p
                    className={`text-3xl p-2 rounded font-black tracking-tight ${
                        playerWon
                            ? "text-yellow-500 shadow-[0_0_18px_rgba(250,204,21,0.6)]"
                            : "text-rose-500"
                    }`}
                >
                    {playerWon
                        ? "🏆 You win the match!"
                        : "💀 You lost the match"}
                </p>

                <p className="text-sm text-muted-foreground dark:text-purple-400">
                    Best of {bestOf} — match complete
                </p>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        onReset();

                        if (mode === "vs-cpu") {
                            router.replace("/rps/game/cpu");
                        } else {
                            router.replace("/rps");
                        }
                    }}
                >
                    Play again
                </Button>
            </CenteredContainer>
        );
    }

    const result = RESULT_CONFIG[currentRound.result];

    return (
        <CenteredContainer animate>
            <div className="flex items-center gap-12">
                <PlayerBlock
                    label="You"
                    choice={currentRound.playerChoice}
                    highlight={currentRound.result === "win"}
                />

                <ResultText result={result} />

                <PlayerBlock
                    label={mode === "online" ? "Opponent" : "CPU"}
                    choice={currentRound.opponentChoice}
                    highlight={currentRound.result === "lose"}
                />
            </div>

            <Button variant="ghost" size="sm" onClick={onNextRound}>
                Next round →
            </Button>
        </CenteredContainer>
    );
}

function CenteredContainer({
    children,
    animate = false,
}: {
    children: React.ReactNode;
    animate?: boolean;
}) {
    return (
        <div
            className={`flex flex-col items-center justify-center gap-4 h-36 ${
                animate
                    ? "animate-in fade-in slide-in-from-bottom-2 duration-300"
                    : ""
            }`}
        >
            {children}
        </div>
    );
}

function ResultText({
    result,
}: {
    result: { label: string; color: string; glow: string };
}) {
    return (
        <span
            className={`text-2xl p-2 rounded font-black tracking-tight ${result.color} ${result.glow}`}
        >
            {result.label}
        </span>
    );
}

function PlayerBlock({
    label,
    choice,
    highlight = false,
}: {
    label: string;
    choice: Choice;
    highlight?: boolean;
}) {
    return (
        <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground dark:text-purple-300">
                {label}
            </span>

            <div
                className={`text-foreground dark:text-purple-200 ${
                    highlight ? "" : ""
                }`}
            >
                {ICONS[choice]}
            </div>

            <span className="text-xs capitalize text-muted-foreground dark:text-purple-200">
                {choice}
            </span>
        </div>
    );
}

function LoadingDots() {
    return (
        <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className="w-3 h-3 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                />
            ))}
        </div>
    );
}
