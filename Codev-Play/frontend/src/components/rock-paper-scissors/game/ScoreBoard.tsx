"use client";

import React from "react";
import { Round, Score, GameMode } from "@/types/rps";
import {
    FaRegHandRock,
    FaRegHandPaper,
    FaRegHandScissors,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";

const ICONS = {
    rock: FaRegHandRock,
    paper: FaRegHandPaper,
    scissors: FaRegHandScissors,
};

const BADGE = {
    win: "bg-emerald-500/15 text-emerald-500 border-emerald-500/40",
    lose: "bg-rose-500/15 text-rose-500 border-rose-500/40",
    draw: "bg-amber-500/15 text-amber-500 border-amber-500/40",
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
    const pct = total === 0 ? 50 : Math.round((score.player / total) * 100);
    const opponent = mode === "online" ? "Opponent" : "CPU";

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
            {/* Score Card */}
            <div className="w-full rounded-2xl border bg-card      dark:bg-[#39327C] text-card-foreground shadow-sm p-5">
                <ScoreHeader
                    player={score.player}
                    opponent={score.opponent}
                    opponentLabel={opponent}
                    winsNeeded={winsNeeded}
                    bestOf={bestOf}
                    rounds={history.length}
                />

                <ProgressBar percent={pct} opponent={opponent} />
            </div>

            {/* History */}
            {history.length > 0 && <HistoryList history={history} />}

            {/* Reset */}
            {history.length > 0 && (
                <Button variant="ghost" size="sm" onClick={onReset}>
                    Reset game
                </Button>
            )}
        </div>
    );
}

/* ================= HEADER ================= */

function ScoreHeader({
    player,
    opponent,
    opponentLabel,
    winsNeeded,
    bestOf,
    rounds,
}: {
    player: number;
    opponent: number;
    opponentLabel: string;
    winsNeeded: number;
    bestOf: number;
    rounds: number;
}) {
    return (
        <div className="flex justify-between items-end mb-4">
            <ScoreBlock label="You" score={player} winsNeeded={winsNeeded} />

            <div className="text-center">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Best of {bestOf}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">
                    {rounds} round{rounds !== 1 && "s"}
                </p>
            </div>

            <ScoreBlock
                label={opponentLabel}
                score={opponent}
                winsNeeded={winsNeeded}
            />
        </div>
    );
}

/* ================= SCORE BLOCK ================= */

function ScoreBlock({
    label,
    score,
    winsNeeded,
}: {
    label: string;
    score: number;
    winsNeeded: number;
}) {
    return (
        <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                {label}
            </p>

            <p className="text-5xl font-black leading-none">{score}</p>

            <p className="text-[10px] text-muted-foreground mt-1">
                / {winsNeeded} to win
            </p>
        </div>
    );
}

/* ================= PROGRESS BAR ================= */

function ProgressBar({
    percent,
    opponent,
}: {
    percent: number;
    opponent: string;
}) {
    return (
        <>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${percent}%` }}
                />
            </div>

            <div className="flex justify-between mt-1 text-[11px]">
                <span className="text-emerald-500">You {percent}%</span>
                <span className="text-rose-500">
                    {opponent} {100 - percent}%
                </span>
            </div>
        </>
    );
}

/* ================= HISTORY ================= */

function HistoryList({ history }: { history: Round[] }) {
    return (
        <div className="w-full">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 text-center">
                Round History
            </p>

            <div className="flex flex-col gap-2">
                {history.map((round, i) => {
                    const IconLeft = ICONS[round.playerChoice];
                    const IconRight = ICONS[round.opponentChoice];

                    return (
                        <div
                            key={round.roundNumber}
                            className={`flex items-center justify-between rounded-xl border bg-muted/40 px-4 py-2 animate-in fade-in slide-in-from-top-2 duration-300`}
                            style={{ opacity: Math.max(0.35, 1 - i * 0.08) }}
                        >
                            {/* Left */}
                            <div className="flex items-center gap-3">
                                <span
                                    className={`text-[10px] font-bold w-5 h-5 rounded border flex items-center justify-center ${BADGE[round.result]}`}
                                >
                                    {round.result[0].toUpperCase()}
                                </span>

                                <ChoiceIcon
                                    Icon={IconLeft}
                                    label={round.playerChoice}
                                />
                            </div>

                            {/* Round number */}
                            <span className="text-xs text-muted-foreground">
                                R{round.roundNumber}
                            </span>

                            {/* Right */}
                            <ChoiceIcon
                                Icon={IconRight}
                                label={round.opponentChoice}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ================= ICON ================= */

function ChoiceIcon({
    Icon,
    label,
}: {
    Icon: React.ComponentType<any>;
    label: string;
}) {
    return (
        <span className="text-sm flex flex-col items-center gap-1">
            <Icon className="w-4 h-4" />
            <span className="text-xs text-muted-foreground capitalize">
                {label}
            </span>
        </span>
    );
}
