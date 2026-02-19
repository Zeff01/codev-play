"use client";

import {
    FaRegHandRock,
    FaRegHandPaper,
    FaRegHandScissors,
} from "react-icons/fa";
import {
    Choice,
    GamePhase,
    Round,
    RoundResult,
} from "@/types/rock-paper-scissor";

const ICONS: Record<Choice, React.ReactNode> = {
    rock: <FaRegHandRock className="w-12 h-12" />,
    paper: <FaRegHandPaper className="w-12 h-12" />,
    scissors: <FaRegHandScissors className="w-12 h-12" />,
};

const RESULT_STYLE: Record<
    RoundResult,
    { label: string; color: string; glow: string }
> = {
    win: {
        label: "You Win!",
        color: "text-emerald-400",
        glow: "drop-shadow(0 0 14px rgba(52,211,153,0.8))",
    },
    lose: {
        label: "You Lose",
        color: "text-rose-400",
        glow: "drop-shadow(0 0 14px rgba(251,113,133,0.8))",
    },
    draw: {
        label: "Draw!",
        color: "text-amber-400",
        glow: "drop-shadow(0 0 14px rgba(251,191,36,0.8))",
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
    // ── Waiting for opponent (online) ────────────────────────────────────
    if (phase === "waiting") {
        return (
            <div className="flex flex-col items-center gap-3 h-36 justify-center">
                <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            className="w-3 h-3 rounded-full bg-purple-400"
                            style={{
                                animation: `pulse-dot 0.8s ease-in-out ${i * 0.18}s infinite`,
                            }}
                        />
                    ))}
                </div>
                <p className="text-purple-300 text-sm tracking-widest uppercase">
                    Waiting for opponent…
                </p>
                <style>{`@keyframes pulse-dot { 0%,100%{transform:translateY(0);opacity:.3} 50%{transform:translateY(-8px);opacity:1} }`}</style>
            </div>
        );
    }

    // ── CPU thinking ─────────────────────────────────────────────────────
    if (phase === "revealing") {
        return (
            <div className="flex flex-col items-center gap-3 h-36 justify-center">
                <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            className="w-3 h-3 rounded-full bg-purple-400"
                            style={{
                                animation: `pulse-dot 0.7s ease-in-out ${i * 0.15}s infinite`,
                            }}
                        />
                    ))}
                </div>
                <p className="text-purple-300 text-sm tracking-widest uppercase">
                    {mode === "online"
                        ? "Waiting for opponent…"
                        : "CPU is choosing…"}
                </p>
                <style>{`@keyframes pulse-dot { 0%,100%{transform:translateY(0);opacity:.3} 50%{transform:translateY(-8px);opacity:1} }`}</style>
            </div>
        );
    }

    // ── Idle / Choosing ──────────────────────────────────────────────────
    if (phase === "idle" || phase === "choosing" || !currentRound) {
        return (
            <div className="flex flex-col items-center h-36 justify-center">
                <p className="text-purple-300 text-lg tracking-wide">
                    Choose your move
                </p>
            </div>
        );
    }

    // ── Game over ────────────────────────────────────────────────────────
    if (phase === "game-over") {
        const isPlayerWinner = winnerId === "player";
        return (
            <div
                className="flex flex-col items-center gap-3 h-36 justify-center"
                style={{ animation: "fade-up 0.35s ease-out" }}
            >
                <p
                    className={`text-3xl font-black tracking-tight ${isPlayerWinner ? "text-yellow-400" : "text-rose-400"}`}
                    style={{
                        filter: isPlayerWinner
                            ? "drop-shadow(0 0 14px rgba(250,204,21,0.7))"
                            : undefined,
                    }}
                >
                    {isPlayerWinner
                        ? "🏆 You win the match!"
                        : "💀 You lost the match"}
                </p>
                <p className="text-purple-400 text-sm">
                    Best of {bestOf} — match complete
                </p>
                <button
                    onClick={onReset}
                    className="text-xs text-purple-400 hover:text-purple-200 underline underline-offset-2 transition-colors cursor-pointer"
                >
                    Play again
                </button>
                <style>{`@keyframes fade-up { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }`}</style>
            </div>
        );
    }

    // ── Round result ─────────────────────────────────────────────────────
    const style = RESULT_STYLE[currentRound.result];

    return (
        <div
            className="flex flex-col items-center gap-4 h-36 justify-center"
            style={{ animation: "fade-up 0.35s ease-out" }}
        >
            <div className="flex items-center gap-10">
                {/* Player */}
                <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-purple-300">
                        You
                    </span>
                    <div
                        className="text-white"
                        style={{
                            filter:
                                currentRound.result === "win"
                                    ? style.glow
                                    : undefined,
                        }}
                    >
                        {ICONS[currentRound.playerChoice]}
                    </div>
                    <span className="text-xs capitalize text-purple-200">
                        {currentRound.playerChoice}
                    </span>
                </div>

                {/* Result badge */}
                <span
                    className={`text-2xl font-black tracking-tight ${style.color}`}
                    style={{ filter: style.glow }}
                >
                    {style.label}
                </span>

                {/* Opponent */}
                <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-purple-300">
                        {mode === "online" ? "Opponent" : "CPU"}
                    </span>
                    <div
                        className="text-white"
                        style={{
                            filter:
                                currentRound.result === "lose"
                                    ? RESULT_STYLE.lose.glow
                                    : undefined,
                        }}
                    >
                        {ICONS[currentRound.opponentChoice]}
                    </div>
                    <span className="text-xs capitalize text-purple-200">
                        {currentRound.opponentChoice}
                    </span>
                </div>
            </div>

            <button
                onClick={onNextRound}
                className="text-xs text-purple-400 hover:text-purple-200 underline underline-offset-2 transition-colors cursor-pointer"
            >
                Next round →
            </button>

            <style>{`@keyframes fade-up { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }`}</style>
        </div>
    );
}
