"use client";

import { useState, useCallback } from "react";
import type {
    Choice,
    RoundResult,
    GameMode,
    GamePhase,
    Score,
    Round,
} from "@/types/rock-paper-scissor";

// ── Helpers ────────────────────────────────────────────────────────────────

const CHOICES: Choice[] = ["rock", "paper", "scissors"];

function randomChoice(): Choice {
    return CHOICES[Math.floor(Math.random() * 3)];
}

function getResult(player: Choice, opponent: Choice): RoundResult {
    if (player === opponent) return "draw";
    if (
        (player === "rock" && opponent === "scissors") ||
        (player === "paper" && opponent === "rock") ||
        (player === "scissors" && opponent === "paper")
    )
        return "win";
    return "lose";
}

const BEST_OF = 5;
const WINS_NEEDED = Math.ceil(BEST_OF / 2); // 3

// ── Hook ───────────────────────────────────────────────────────────────────

export function useRpsStore() {
    const [mode, setMode] = useState<GameMode | null>(null);
    const [phase, setPhase] = useState<GamePhase>("idle");
    const [score, setScore] = useState<Score>({ player: 0, opponent: 0 });
    const [history, setHistory] = useState<Round[]>([]);
    const [currentRound, setCurrentRound] = useState<Round | null>(null);
    const [roundNumber, setRoundNumber] = useState(1);
    const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
    const [winnerId, setWinnerId] = useState<"player" | "opponent" | null>(
        null,
    );

    const startVsCpu = useCallback(() => {
        setMode("vs-cpu");
        setPhase("choosing");
        setScore({ player: 0, opponent: 0 });
        setHistory([]);
        setCurrentRound(null);
        setRoundNumber(1);
        setPlayerChoice(null);
        setWinnerId(null);
    }, []);

    /**
     * Online mode: call this to initialise — then wire up your
     * real-time transport (Supabase, Socket.io, etc.) separately.
     * When the opponent's choice arrives, call resolveOnlineRound().
     */
    const startOnline = useCallback(() => {
        setMode("online");
        setPhase("waiting"); // waiting for opponent to connect
        setScore({ player: 0, opponent: 0 });
        setHistory([]);
        setCurrentRound(null);
        setRoundNumber(1);
        setPlayerChoice(null);
        setWinnerId(null);
    }, []);

    /** Called by your online transport once the opponent has joined */
    const opponentJoined = useCallback(() => {
        setPhase("choosing");
    }, []);

    // ── Gameplay ─────────────────────────────────────────────────────────

    const submitChoice = useCallback(
        (choice: Choice) => {
            if (phase !== "choosing") return;
            setPlayerChoice(choice);
            setPhase("revealing");

            if (mode === "vs-cpu") {
                // Resolve locally after a short delay
                setTimeout(() => {
                    const opponentChoice = randomChoice();
                    // eslint-disable-next-line react-hooks/immutability
                    _resolveRound(choice, opponentChoice);
                }, 900);
            }
            // online: wait for resolveOnlineRound() to be called externally
        },
        [phase, mode],
    ); // eslint-disable-line react-hooks/exhaustive-deps

    /**
     * Call this from your online transport handler when the opponent's
     * choice comes in (e.g. inside a Supabase channel.on() callback).
     */
    const resolveOnlineRound = useCallback((opponentChoice: Choice) => {
        setPlayerChoice((current) => {
            if (current) _resolveRound(current, opponentChoice);
            return current;
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Internal — shared by both modes
    function _resolveRound(player: Choice, opponent: Choice) {
        const result = getResult(player, opponent);

        const round: Round = {
            roundNumber,
            playerChoice: player,
            opponentChoice: opponent,
            result,
        };

        setCurrentRound(round);
        setHistory((prev) => [round, ...prev].slice(0, 10));

        setScore((prev) => {
            const next = {
                player: prev.player + (result === "win" ? 1 : 0),
                opponent: prev.opponent + (result === "lose" ? 1 : 0),
            };

            if (next.player >= WINS_NEEDED) {
                setWinnerId("player");
                setPhase("game-over");
            } else if (next.opponent >= WINS_NEEDED) {
                setWinnerId("opponent");
                setPhase("game-over");
            } else {
                setPhase("round-over");
            }

            return next;
        });
    }

    const nextRound = useCallback(() => {
        if (phase !== "round-over") return;
        setCurrentRound(null);
        setPlayerChoice(null);
        setRoundNumber((n) => n + 1);
        setPhase("choosing");
    }, [phase]);

    const reset = useCallback(() => {
        setMode(null);
        setPhase("idle");
        setScore({ player: 0, opponent: 0 });
        setHistory([]);
        setCurrentRound(null);
        setRoundNumber(1);
        setPlayerChoice(null);
        setWinnerId(null);
    }, []);

    return {
        // State
        mode,
        phase,
        score,
        history,
        currentRound,
        roundNumber,
        playerChoice,
        winnerId,
        winsNeeded: WINS_NEEDED,
        bestOf: BEST_OF,

        // Actions
        startVsCpu,
        startOnline,
        opponentJoined,
        submitChoice,
        resolveOnlineRound,
        nextRound,
        reset,
    };
}
