"use client";

import { create } from "zustand";
import type { Socket } from "socket.io-client";
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

// ── Socket Event Types ──────────────────────────────────────────────────────

type RoomData = {
    id: string;
    name: string;
    playerCount: number;
    players: string[];
    createdAt: Date;
    gameType?: string;
    gameId?: string;
};

type RoomEventData = {
    success: boolean;
    room: RoomData;
};

type PlayerJoinedData = {
    playerId: string;
    room: RoomData;
};

type RoomsListData = RoomData[];

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
    rooms: Array<{ id: string; players: number; gameType?: string }>;
    roomId: string | null;
    isHost: boolean;
    hasOpponent: boolean;
    winsNeeded: number;
    bestOf: number;
    socket: Socket | null;

    // Actions
    startVsCpu: () => void;
    startOnline: () => void;
    opponentJoined: () => void; // mark opponent presence
    submitChoice: (choice: Choice) => void;
    resolveOnlineRound: (opponentChoice: Choice) => void;
    nextRound: () => void;
    reset: () => void;
    createRoom: () => void;
    joinRoom: (id: string) => void;
    leaveRoom: () => void;
    startMatch: () => void;
    getRooms: () => void;
    setSocket: (socket: Socket) => void;
    updateRooms: (
        rooms: Array<{ id: string; players: number; gameType?: string }>,
    ) => void;
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
    hasOpponent: false,
    winsNeeded: WINS_NEEDED,
    bestOf: BEST_OF,
    socket: null,

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
        // mark that another player is in the room, host can now start
        set({ hasOpponent: true });
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
            hasOpponent: false,
        });
    },

    createRoom: () => {
        const socket = get().socket;
        if (!socket) {
            console.warn("Socket not connected");
            return;
        }

        set({ hasOpponent: false });
        socket.emit("room:create", { gameType: "rps" });
    },

    joinRoom: (id: string) => {
        const socket = get().socket;
        if (!socket) {
            console.warn("Socket not connected");
            return;
        }

        set({ hasOpponent: true }); // joining implies another player (host) is present
        socket.emit("room:join", { roomId: id });
    },

    leaveRoom: () => {
        const socket = get().socket;
        const roomId = get().roomId;
        if (!socket || !roomId) {
            console.warn("Socket not connected or no room to leave");
            return;
        }

        socket.emit("room:leave", { roomId });
        set({
            roomId: null,
            isHost: false,
            phase: "lobby",
        });
    },

    getRooms: () => {
        const socket = get().socket;
        if (!socket) {
            console.warn("Socket not connected");
            return;
        }

        socket.emit("rooms:get");
    },

    setSocket: (socket: Socket) => {
        set({ socket });

        // Listen for room creation
        socket.on("room:created", (data: RoomEventData) => {
            if (data.success) {
                set({
                    roomId: data.room.id,
                    isHost: true,
                    mode: "online",
                    phase: "room",
                });
            }
        });

        // Listen for room join
        socket.on("room:joined", (data: RoomEventData) => {
            if (data.success) {
                set({
                    roomId: data.room.id,
                    isHost: false,
                    mode: "online",
                    phase: "room",
                });
            }
        });

        // Listen for player joined event
        socket.on("player:joined", (data: PlayerJoinedData) => {
            console.log("Player joined room:", data);
            // host learns that opponent arrived
            get().opponentJoined();
        });

        // Listen for rooms list update
        socket.on("rooms:list", (rooms: RoomsListData) => {
            const formattedRooms = rooms.map((room) => ({
                id: room.id,
                players: room.playerCount,
                gameType: room.gameType,
            }));
            set({ rooms: formattedRooms });
        });

        // match start event
        socket.on("match:started", () => {
            set({ phase: "choosing" });
        });
        // Listen for errors
        socket.on("room:error", (data: { message: string }) => {
            console.error("Room error:", data.message);
        });
    },

    updateRooms: (
        rooms: Array<{ id: string; players: number; gameType?: string }>,
    ) => {
        set({ rooms });
    },

    startMatch: () => {
        const state = get();
        if (!state.isHost || !state.roomId) return;
        const socket = state.socket;
        if (socket) {
            socket.emit("room:start", { roomId: state.roomId });
        }
        // actual phase change will happen when server broadcasts match:started
    },
}));
