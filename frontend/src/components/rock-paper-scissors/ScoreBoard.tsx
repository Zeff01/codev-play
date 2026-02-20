"use client";

import React from "react";
import { Round, Score, GameMode } from "@/types/rock-paper-scissor";
import {
    FaRegHandRock,
    FaRegHandPaper,
    FaRegHandScissors,
} from "react-icons/fa";
import { IconType } from "react-icons";

const BADGE: Record<string, { label: string; classes: string }> = {
    win: {
        label: "W",
        classes: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    },
    lose: {
        label: "L",
        classes: "bg-rose-500/20    text-rose-400    border-rose-500/40",
    },
    draw: {
        label: "D",
        classes: "bg-amber-500/20   text-amber-400   border-amber-500/40",
    },
};

const EMOJI: Record<string, IconType> = {
    rock: FaRegHandRock,
    paper: FaRegHandPaper,
    scissors: FaRegHandScissors,
};

type Props = {
    score: Score;
    history: Round[];
    mode: GameMode | null;
    winsNeeded: number;
    bestOf: number;
    onReset: () => void;
};

export default function ScoreBoard({
    score,
    history,
    mode,
    winsNeeded,
    bestOf,
    onReset,
}: Props) {
    if (!mode) return null;

    const total = score.player + score.opponent;
    const playerPct =
        total === 0 ? 50 : Math.round((score.player / total) * 100);
    const opponentLabel = mode === "online" ? "Opponent" : "CPU";

    return (
        <div className="flex flex-col items-center gap-5 w-full max-w-md">
            {/* ── Score tracker ───────────────────────────────────── */}
            <div className="w-full bg-[#39327C]/60 rounded-2xl p-5 border border-white/10">
                <div className="flex justify-between items-end mb-3">
                    <div className="text-center">
                        <p className="text-[10px] uppercase tracking-widest text-purple-300 mb-1">
                            You
                        </p>
                        <p className="text-5xl font-black text-white leading-none">
                            {score.player}
                        </p>
                        <p className="text-[10px] text-purple-400 mt-1">
                            / {winsNeeded} to win
                        </p>
                    </div>

                    <div className="text-center">
                        <p className="text-xs text-purple-400 uppercase tracking-widest">
                            Best of {bestOf}
                        </p>
                        <p className="text-[10px] text-purple-500 mt-1">
                            {history.length} round
                            {history.length !== 1 ? "s" : ""}
                        </p>
                    </div>

                    <div className="text-center">
                        <p className="text-[10px] uppercase tracking-widest text-purple-300 mb-1">
                            {opponentLabel}
                        </p>
                        <p className="text-5xl font-black text-white leading-none">
                            {score.opponent}
                        </p>
                        <p className="text-[10px] text-purple-400 mt-1">
                            / {winsNeeded} to win
                        </p>
                    </div>
                </div>

                {/* Win-rate bar */}
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-linear-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                        style={{ width: `${playerPct}%` }}
                    />
                </div>
                <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-emerald-400">
                        You {playerPct}%
                    </span>
                    <span className="text-[10px] text-rose-400">
                        {opponentLabel} {100 - playerPct}%
                    </span>
                </div>
            </div>

            {/* ── Round history ───────────────────────────────────── */}
            {history.length > 0 && (
                <div className="w-full">
                    <p className="text-[10px] uppercase tracking-widest text-purple-400 mb-2 text-center">
                        Round History
                    </p>
                    <div className="flex flex-col gap-1.5">
                        {history.map((round, i) => {
                            const badge = BADGE[round.result];
                            return (
                                <div
                                    key={round.roundNumber}
                                    className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2 border border-white/8"
                                    style={{
                                        animation:
                                            i === 0
                                                ? "fade-down 0.3s ease-out"
                                                : undefined,
                                        opacity: Math.max(0.3, 1 - i * 0.08),
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`text-[10px] font-bold w-5 h-5 rounded border flex items-center justify-center ${badge.classes}`}
                                        >
                                            {badge.label}
                                        </span>
                                        <span className="text-sm flex flex-col items-center gap-1">
                                            {React.createElement(
                                                EMOJI[round.playerChoice],
                                            )}{" "}
                                            <span className="text-white/40 text-xs capitalize">
                                                {round.playerChoice}
                                            </span>
                                        </span>
                                    </div>

                                    <span className="text-purple-500 text-xs">
                                        R{round.roundNumber}
                                    </span>

                                    <span className="text-sm flex flex-col items-center gap-1">
                                        {React.createElement(
                                            EMOJI[round.opponentChoice],
                                        )}
                                        <span className="text-white/40 text-xs capitalize">
                                            {round.opponentChoice}
                                        </span>{" "}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── Reset ───────────────────────────────────────────── */}
            {history.length > 0 && (
                <button
                    onClick={onReset}
                    className="text-xs text-purple-400 hover:text-purple-200 underline underline-offset-2 transition-colors cursor-pointer"
                >
                    Reset game
                </button>
            )}

            <style>{`@keyframes fade-down { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }`}</style>
        </div>
    );
}
