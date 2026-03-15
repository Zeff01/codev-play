import type { StateCreator } from "zustand";
import type { Choice, Score, Round } from "@/types/rps";
import { WINS_NEEDED, BEST_OF } from "@/types/rps";
import { randomChoice, getResult } from "./gameLogic";
import type { RpsStore } from "./store.types";

const HISTORY_LIMIT = 10;

export type GameSlice = {
    timer: number;
    setTimer: (value: number) => void;
    tick: () => void;
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

    // In online mode this should be triggered by a socket event from the backend
    resolveOnlineRound: (opponentChoice: Choice) => void;

    nextRound: () => void;
    reset: () => void;
};

export const createGameSlice: StateCreator<RpsStore, [], [], GameSlice> = (
    set,
    get,
) => ({
    timer: 5,
    setTimer: (value) => set({ timer: value }),
    tick: () =>
        set((state) => ({
            timer: Math.max(state.timer - 1, 0),
        })),

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
            timer: 5,
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
        const { phase, mode, roundNumber, socket, roomId, playerChoice } =
            get();

        if (phase !== "choosing") return;

        // prevent double clicking choices
        if (playerChoice) return;

        set({ playerChoice: choice, phase: "revealing" });

        // CPU MODE (handled fully in frontend)
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
                    const nextScore = {
                        player: prev.score.player + (result === "win" ? 1 : 0),
                        opponent:
                            prev.score.opponent + (result === "lose" ? 1 : 0),
                    };

                    const isGameOver =
                        nextScore.player >= WINS_NEEDED ||
                        nextScore.opponent >= WINS_NEEDED;

                    return {
                        currentRound: round,
                        history: [round, ...prev.history].slice(
                            0,
                            HISTORY_LIMIT,
                        ),
                        score: nextScore,
                        winnerId: isGameOver
                            ? nextScore.player >= WINS_NEEDED
                                ? "player"
                                : "opponent"
                            : null,
                        phase: isGameOver ? "game-over" : "round-over",
                    };
                });
            }, 900);

            return;
        }

        // ONLINE MODE
        // Backend should receive the player's choice and resolve the round
        // The backend should then emit something like "round:resolved"
        // which will trigger resolveOnlineRound on the client.

        if (mode === "online") {
            socket?.emit("game:choice", {
                roomId,
                choice,
            });
        }
    },

    resolveOnlineRound: (opponentChoice) => {
        const { playerChoice, roundNumber } = get();
        if (!playerChoice) return;

        // Ideally the backend should send the FULL round result
        // including winner and updated scores. This calculation is only
        // here as a fallback or temporary client-side logic.

        const result = getResult(playerChoice, opponentChoice);

        const round: Round = {
            roundNumber,
            playerChoice,
            opponentChoice,
            result,
        };

        set((prev) => {
            const nextScore = {
                player: prev.score.player + (result === "win" ? 1 : 0),
                opponent: prev.score.opponent + (result === "lose" ? 1 : 0),
            };

            const isGameOver =
                nextScore.player >= WINS_NEEDED ||
                nextScore.opponent >= WINS_NEEDED;

            return {
                currentRound: round,
                history: [round, ...prev.history].slice(0, HISTORY_LIMIT),
                score: nextScore,
                winnerId: isGameOver
                    ? nextScore.player >= WINS_NEEDED
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
            timer: 5,
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
