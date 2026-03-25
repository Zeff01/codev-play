import type { StateCreator } from "zustand";
import type { Choice, Score, Round } from "@/types/rps";
import { WINS_NEEDED, BEST_OF } from "@/types/rps";
import { randomChoice, getResult } from "./gameLogic";
import type { RpsStore } from "./store.types";

export type GameSlice = {
    score: Score;
    history: Round[];
    currentRound: Round | null;
    roundNumber: number;
    playerChoice: Choice | null;
    winnerId: "player" | "opponent" | null;
    winsNeeded: number;
    bestOf: number;

    startVsCpu: () => void;
    startOnline: () => void;
    submitChoice: (choice: Choice) => void;
    resolveOnlineRound: (opponentChoice: Choice) => void;
    nextRound: () => void;
    reset: () => void;
};

export const createGameSlice: StateCreator<RpsStore, [], [], GameSlice> = (
    set,
    get,
) => ({
    mode: null,
    phase: "idle",
    score: { player: 0, opponent: 0 },
    history: [],
    currentRound: null,
    roundNumber: 1,
    playerChoice: null,
    winnerId: null,
    winsNeeded: WINS_NEEDED,
    bestOf: BEST_OF,

    startVsCpu: () =>
        set({
            mode: "vs-cpu",
            phase: "choosing",
            score: { player: 0, opponent: 0 },
            history: [],
            currentRound: null,
            roundNumber: 1,
            playerChoice: null,
            winnerId: null,
        }),

    startOnline: () =>
        set({
            mode: "online",
            phase: "lobby",
            score: { player: 0, opponent: 0 },
            history: [],
            currentRound: null,
            roundNumber: 1,
            playerChoice: null,
            winnerId: null,
        }),

    submitChoice: (choice) => {
        const { phase, mode, roundNumber } = get();
        if (phase !== "choosing") return;

        set({ playerChoice: choice, phase: "revealing" });

        if (mode === "vs-cpu") {
            setTimeout(() => {
                const opponentChoice = randomChoice();
                const result = getResult(choice, opponentChoice);
                const round: Round = {
                    roundNumber,
                    playerChoice: choice,
                    opponentChoice,
                    result,
                };

                set((prev) => {
                    const next = {
                        player: prev.score.player + (result === "win" ? 1 : 0),
                        opponent:
                            prev.score.opponent + (result === "lose" ? 1 : 0),
                    };
                    const isGameOver =
                        next.player >= WINS_NEEDED ||
                        next.opponent >= WINS_NEEDED;
                    return {
                        currentRound: round,
                        history: [round, ...prev.history].slice(0, 10),
                        score: next,
                        winnerId: isGameOver
                            ? next.player >= WINS_NEEDED
                                ? "player"
                                : "opponent"
                            : null,
                        phase: isGameOver ? "game-over" : "round-over",
                    };
                });
            }, 900);
        }
    },

    resolveOnlineRound: (opponentChoice) => {
        const { playerChoice, roundNumber } = get();
        if (!playerChoice) return;

        const result = getResult(playerChoice, opponentChoice);
        const round: Round = {
            roundNumber,
            playerChoice,
            opponentChoice,
            result,
        };

        set((prev) => {
            const next = {
                player: prev.score.player + (result === "win" ? 1 : 0),
                opponent: prev.score.opponent + (result === "lose" ? 1 : 0),
            };
            const isGameOver =
                next.player >= WINS_NEEDED || next.opponent >= WINS_NEEDED;
            return {
                currentRound: round,
                history: [round, ...prev.history].slice(0, 10),
                score: next,
                winnerId: isGameOver
                    ? next.player >= WINS_NEEDED
                        ? "player"
                        : "opponent"
                    : null,
                phase: isGameOver ? "game-over" : "round-over",
            };
        });
    },

    nextRound: () => {
        const { phase, roundNumber } = get();
        if (phase !== "round-over") return;
        set({
            currentRound: null,
            playerChoice: null,
            roundNumber: roundNumber + 1,
            phase: "choosing",
        });
    },

    reset: () =>
        set({
            mode: null,
            phase: "idle",
            score: { player: 0, opponent: 0 },
            history: [],
            currentRound: null,
            roundNumber: 1,
            playerChoice: null,
            winnerId: null,
        }),
});
