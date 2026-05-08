
import { Server, Socket } from "socket.io";
import { RoomManager } from "@/utils/room-manager";
import { ChessService } from "@/services/chess/chess.services";
import { ChessModel } from "@/models/chess.model";
import { ChessSocket } from "@/sockets/chess.socket";
import { GameDisconnectHandler } from "@/services/chess/chess.disconnecthandler";
import logger from "@/utils/logger";

const chessSocket = new ChessSocket();
const chessService = new ChessService(chessSocket, new ChessModel());

const clockIntervals = new Map<string, NodeJS.Timeout>();

function startClockSync(io: Server, gameId: string, getGame: () => Promise<any>) {
    if (clockIntervals.has(gameId)) clearInterval(clockIntervals.get(gameId)!);

    const interval = setInterval(async () => {
        try {
            const game = await getGame();
            if (!game || game.status !== "ongoing") {
                clearInterval(interval);
                clockIntervals.delete(gameId);
                return;
            }
        io.to(`game:${gameId}`).emit("chess:clockSync", {
            w: Math.floor(game.white_time_left / 1000),
            b: Math.floor(game.black_time_left / 1000),
        });
        } catch {
            clearInterval(interval);
            clockIntervals.delete(gameId);
        }
    }, 1000);

    clockIntervals.set(gameId, interval);
}



export function registerChessEvents(
    io: Server,
    socket: Socket,
    roomManager: RoomManager,
    userSocketMap: Map<string, string>,
) {
    socket.on("chess:startClock", (data: { gameId: string }) => {
        const userId = socket.data.userId;
        if (!userId) { socket.emit("chess:error", { message: "Not authenticated" }); return; }
        startClockSync(io, data.gameId, () => chessService.fetchGame(data.gameId));
        logger.info(`Clock sync started for game ${data.gameId}`);
    });

    socket.on("chess:resign", async (data: { gameId: string }) => {
        try {
            const userId = socket.data.userId;
            if (!userId) { socket.emit("chess:error", { message: "Not authenticated" }); return; }
            await chessService.resignGame(data.gameId, userId);
            if (clockIntervals.has(data.gameId)) {
                clearInterval(clockIntervals.get(data.gameId)!);
                clockIntervals.delete(data.gameId);
            }
            logger.info(`User ${userId} resigned game ${data.gameId}`);
        } catch (err: any) {
            socket.emit("chess:error", { message: err.message || "Failed to resign" });
        }
    });

    socket.on("chess:offerDraw", async (data: { gameId: string }) => {
        try {
            const userId = socket.data.userId;
            if (!userId) { socket.emit("chess:error", { message: "Not authenticated" }); return; }
            await chessService.offerDraw(data.gameId, userId);
        } catch (err: any) {
            socket.emit("chess:error", { message: err.message || "Failed to offer draw" });
        }
    });

    socket.on("chess:acceptDraw", async (data: { gameId: string }) => {
        try {
            const userId = socket.data.userId;
            if (!userId) { socket.emit("chess:error", { message: "Not authenticated" }); return; }
            await chessService.acceptDraw(data.gameId, userId);
            if (clockIntervals.has(data.gameId)) {
                clearInterval(clockIntervals.get(data.gameId)!);
                clockIntervals.delete(data.gameId);
            }
        } catch (err: any) {
            socket.emit("chess:error", { message: err.message || "Failed to accept draw" });
        }
    });

    socket.on("chess:declineDraw", async (data: { gameId: string }) => {
        try {
            const userId = socket.data.userId;
            if (!userId) { socket.emit("chess:error", { message: "Not authenticated" }); return; }
            await chessService.rejectDraw(data.gameId, userId);
        } catch (err: any) {
            socket.emit("chess:error", { message: err.message || "Failed to decline draw" });
        }
    });

    socket.on("disconnect", () => {
        const userId = socket.data.userId;
        if (!userId) return;
        const playerRoom = roomManager.getPlayerRoom(socket.id);
        if (!playerRoom || playerRoom.gameType !== "chess") return;
        const gameId = playerRoom.gameId;
        if (!gameId) return;

        const disconnectHandler = new GameDisconnectHandler(io, chessService, new ChessModel(), chessSocket);
        disconnectHandler.handleDisconnect(gameId, userId);

        if (clockIntervals.has(gameId)) {
            clearInterval(clockIntervals.get(gameId)!);
            clockIntervals.delete(gameId);
        }
    });
}