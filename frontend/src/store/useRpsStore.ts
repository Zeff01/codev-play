"use client";

import { create } from "zustand";
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

// ── Types ──────────────────────────────────────────────────────────────────

type RpsState = {
    mode: GameMode | null;
    phase: GamePhase;
    score: Score;
    history: Round[];
    currentRound: Round | null;
    roundNumber: number;
    playerChoice: Choice | null;
    winnerId: "player" | "opponent" | null;
    rooms: Array<{ id: string; players: number }>;
    roomId: string | null;
    isHost: boolean;
    winsNeeded: number;
    bestOf: number;

    // Actions
    startVsCpu: () => void;
    startOnline: () => void;
    opponentJoined: () => void;
    submitChoice: (choice: Choice) => void;
    resolveOnlineRound: (opponentChoice: Choice) => void;
    nextRound: () => void;
    reset: () => void;
    createRoom: () => void;
    joinRoom: (id: string) => void;
    leaveRoom: () => void;
    startMatch: () => void;
    getRooms: () => void;
};

// ── Store ──────────────────────────────────────────────────────────────────

export const useRpsStore = create<RpsState>((set, get) => ({
    mode: null,
    phase: "idle",
    score: { player: 0, opponent: 0 },
    history: [],
    currentRound: null,
    roundNumber: 1,
    playerChoice: null,
    winnerId: null,
    rooms: [],
    roomId: null,
    isHost: false,
    winsNeeded: WINS_NEEDED,
    bestOf: BEST_OF,

    startVsCpu: () => {
        set({
            mode: "vs-cpu",
            phase: "choosing",
            score: { player: 0, opponent: 0 },
            history: [],
            currentRound: null,
            roundNumber: 1,
            playerChoice: null,
            winnerId: null,
        });
    },

    startOnline: () => {
        set({
            mode: "online",
            phase: "lobby",
            score: { player: 0, opponent: 0 },
            history: [],
            currentRound: null,
            roundNumber: 1,
            playerChoice: null,
            winnerId: null,
        });
    },

    opponentJoined: () => {
        set({ phase: "choosing" });
    },

    submitChoice: (choice: Choice) => {
        const state = get();
        if (state.phase !== "choosing") return;

        set({ playerChoice: choice, phase: "revealing" });

        if (state.mode === "vs-cpu") {
            setTimeout(() => {
                const opponentChoice = randomChoice();
                const result = getResult(choice, opponentChoice);

                const round: Round = {
                    roundNumber: state.roundNumber,
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

                    let newPhase: GamePhase = "round-over";
                    let newWinnerId: "player" | "opponent" | null = null;

                    if (next.player >= WINS_NEEDED) {
                        newWinnerId = "player";
                        newPhase = "game-over";
                    } else if (next.opponent >= WINS_NEEDED) {
                        newWinnerId = "opponent";
                        newPhase = "game-over";
                    }

                    return {
                        currentRound: round,
                        history: [round, ...prev.history].slice(0, 10),
                        score: next,
                        winnerId: newWinnerId,
                        phase: newPhase,
                    };
                });
            }, 900);
        }
    },

    resolveOnlineRound: (opponentChoice: Choice) => {
        const state = get();
        const playerChoice = state.playerChoice;
        if (!playerChoice) return;

        const result = getResult(playerChoice, opponentChoice);

        const round: Round = {
            roundNumber: state.roundNumber,
            playerChoice,
            opponentChoice,
            result,
        };

        set((prev) => {
            const next = {
                player: prev.score.player + (result === "win" ? 1 : 0),
                opponent: prev.score.opponent + (result === "lose" ? 1 : 0),
            };

            let newPhase: GamePhase = "round-over";
            let newWinnerId: "player" | "opponent" | null = null;

            if (next.player >= WINS_NEEDED) {
                newWinnerId = "player";
                newPhase = "game-over";
            } else if (next.opponent >= WINS_NEEDED) {
                newWinnerId = "opponent";
                newPhase = "game-over";
            }

            return {
                currentRound: round,
                history: [round, ...prev.history].slice(0, 10),
                score: next,
                winnerId: newWinnerId,
                phase: newPhase,
            };
        });
    },

    nextRound: () => {
        const state = get();
        if (state.phase !== "round-over") return;

        set({
            currentRound: null,
            playerChoice: null,
            roundNumber: state.roundNumber + 1,
            phase: "choosing",
        });
    },

    reset: () => {
        set({
            mode: null,
            phase: "idle",
            score: { player: 0, opponent: 0 },
            history: [],
            currentRound: null,
            roundNumber: 1,
            playerChoice: null,
            winnerId: null,
            roomId: null,
            isHost: false,
        });
    },

    createRoom: () => {
        const newRoomId = crypto.randomUUID();
        set({
            roomId: newRoomId,
            isHost: true,
            mode: "online",
            phase: "room",
            score: { player: 0, opponent: 0 },
            history: [],
            currentRound: null,
            roundNumber: 1,
            playerChoice: null,
            winnerId: null,
        });
    },

    joinRoom: (id: string) => {
        set({
            roomId: id,
            isHost: false,
            mode: "online",
            phase: "room",
            score: { player: 0, opponent: 0 },
            history: [],
            currentRound: null,
            roundNumber: 1,
            playerChoice: null,
            winnerId: null,
        });
    },

    leaveRoom: () => {
        set({
            roomId: null,
            isHost: false,
            phase: "lobby",
        });
    },

    startMatch: () => {
        const state = get();
        if (!state.isHost) return;
        set({ phase: "choosing" });
    },

    getRooms: () => {
        set({
            rooms: [
                { id: "room-1", players: 1 },
                { id: "room-2", players: 2 },
                { id: "room-3", players: 1 },
            ],
        });
    },
}));
