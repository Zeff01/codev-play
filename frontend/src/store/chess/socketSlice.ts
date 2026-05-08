import type { StateCreator } from "zustand";
import type { Socket } from "socket.io-client";
import type { ChessStore } from "./store.types";
import type { Color, GameStatus } from "@/types/chess.type";

export type SocketSlice = {
    socket: Socket | null;
    socketId: string | null;
    setSocket: (socket: Socket) => void;
};

export const createSocketSlice: StateCreator<ChessStore, [], [], SocketSlice> = (set, get) => ({
    socket: null,
    socketId: null,

    setSocket: (socket) => {
        if (!socket) {
            set({ socket: null, socketId: null });
            return;
        }

        // prevent duplicate listeners
        socket.off();

        set({
            socket,
            socketId: socket.id ?? null,
        });

        // --- ROOM EVENTS ---

        socket.on("room:created", (data: { success: boolean; room: any }) => {
            if (!data.success) return;

            set({
                currentRoom: {
                    id: data.room.id,
                    name: data.room.name,
                    players: data.room.playerCount ?? 1,
                    maxPlayers: 2,
                    timeControl: data.room.timeControl ?? 600,
                },
                phase: "room",
            });
        });

        socket.on("room:joined", (data: { success: boolean; room: any }) => {
            if (!data.success) return;

            set({
                currentRoom: {
                    id: data.room.id,
                    name: data.room.name,
                    players: data.room.playerCount ?? 1,
                    maxPlayers: 2,
                    timeControl: data.room.timeControl ?? 600,
                },
                phase: "room",
            });
        });

        socket.on("rooms:list", (data: { gameType?: string; rooms: any[] }) => {
            const formattedRooms = (data.rooms || [])
                .filter((r) => r.gameType === "chess")
                .map((r) => ({
                    id: r.id,
                    name: r.name,
                    players: r.playerCount ?? 0,
                    maxPlayers: 2 as const,
                    timeControl: r.timeControl ?? 600,
                }));

            set({ rooms: formattedRooms });
        });

        socket.on("player:joined", (data: any) => {
            const room = get().currentRoom;

            if (room) {
                set({ currentRoom: { ...room, players: 2 } });
            }
        });

        // --- GAME START ---

        socket.on(
            "chess:gameStart",
            (data: { playerColor: Color; timeControl: number; gameId: string }) => {
                socket.emit("game:join", {
                    gameId: data.gameId,
                    gameType: "chess",
                });

                get().startGame(data.playerColor, data.timeControl);
                get().setGameId(data.gameId);

                socket.emit("chess:startClock", { gameId: data.gameId });
            }
        );

        // --- MOVES ---

        socket.on(
            "game:move",
            (data: { gameId: string; game: any; moveData: any }) => {
                console.log("game:move received", data.game?.status, data.game?.is_check);
                const game = data.game;
                if (!game) return;

                const { playerColor } = get();

                const movingColor: Color =
                game.move?.color ?? (game.current_turn === "w" ? "b" : "w");

                if (playerColor && movingColor === playerColor) return;

                console.log("game:move debug", {
                    playerColor: get().playerColor,
                    movingColor,
                    moveColor: game.move?.color,
                    currentTurn: game.current_turn,
                });

                const statusMap: Record<string, GameStatus> = {
                    ongoing: "playing",
                    checkmate: "checkmate",
                    stalemate: "stalemate",
                    draw: "draw",
                    repetition: "draw",
                    insufficient_material: "draw",
                    "50_move_rule": "draw",
                    resigned: "resigned",
                };

                const status: GameStatus =
                    statusMap[game.status] ?? "playing";

                const finalStatus =
                    game.is_check && status === "playing"
                        ? "check"
                        : status;

                get().applyServerMove(
                    game.fen_position,
                    game.move?.san ?? "",
                    movingColor,
                    finalStatus as GameStatus
                );
            }
        );

        // --- CLOCK ---

        socket.on("chess:clockSync", (data: { w: number; b: number }) => {
            set({ clocks: { w: data.w, b: data.b } });
        });

        // --- GAME END ---

        socket.on("chess:end", (data: { status: string; winner: string | null }) => {
            const statusMap: Record<string, GameStatus> = {
                checkmate: "checkmate",
                stalemate: "stalemate",
                draw: "draw",
                resigned: "resigned",
                timeout: "checkmate",
                disconnect: "resigned",
            };

            get().endGame(statusMap[data.status] ?? "resigned");
        });

        // --- DRAW ---

        socket.on(
            "chess:draw",
            (data: { drawStatus: string; offeredBy: number; status: string }) => {
                if (data.drawStatus === "pending") {
                    set({ drawOfferedBy: data.offeredBy });
                } else if (data.drawStatus === "accepted") {
                    get().endGame("draw");
                    set({ drawOfferedBy: null });
                } else if (data.drawStatus === "rejected") {
                    set({ drawOfferedBy: null });
                }
            }
        );

        // --- ERRORS ---

        socket.on("chess:error", (data: { message: string }) => {
            console.error("Chess socket error:", data.message);
        });

        socket.on("room:error", (data: { message: string }) => {
            console.error("Room error:", data.message);
        });
    },
});