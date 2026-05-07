import { Server, Socket } from "socket.io";
import { RoomManager } from "@/utils/room-manager";
import { ChessService } from "@/services/chess/chess.services";
import { ChessModel } from "@/models/chess.model";
import { ChessSocket } from "@/sockets/chess.socket";
import { userSocketMap } from "@/config/socket-server";
import logger from "@/utils/logger";

const chessSocket = new ChessSocket();
const chessService = new ChessService(chessSocket, new ChessModel());

export function registerRoomEvents(io: Server, socket: Socket, roomManager: RoomManager) {
    socket.on("room:create", (data: { roomName?: string; gameType?: "tictactoe" | "snake" | "rps" | "chess" }) => {
        try {
            const room = roomManager.createRoom(socket.id, data?.roomName, data?.gameType);
            socket.join(room.id);
            socket.emit("room:created", { success: true, room: roomManager.getRoomInfo(room.id) });
            logger.info(`Created room ${room.id} for user ${socket.id}`);
            const filteredRooms = roomManager.listRooms().filter((r) => r.gameType === data?.gameType);
            io.emit("rooms:list", { gameType: data?.gameType, rooms: filteredRooms });
        } catch (err) {
            logger.error("Error creating room", { error: err });
            socket.emit("room:error", { message: "Failed to create room" });
        }
    });

    socket.on("room:join", (data: { roomId: string }) => {
        try {
            const success = roomManager.joinRoom(data.roomId, socket.id);
            if (!success) { socket.emit("room:error", { message: "Room not found" }); return; }
            socket.join(data.roomId);
            const room = roomManager.getRoom(data.roomId);
            socket.emit("room:joined", { success: true, room: roomManager.getRoomInfo(data.roomId) });
            socket.to(data.roomId).emit("player:joined", { playerId: socket.id, room: roomManager.getRoomInfo(data.roomId) });
            const filteredRooms = roomManager.listRooms().filter((r) => r.gameType === room?.gameType);
            io.emit("rooms:list", { gameType: room?.gameType, rooms: filteredRooms });
        } catch (err) {
            logger.error("Error joining room", { error: err });
            socket.emit("room:error", { message: "Failed to join room" });
        }
    });

    socket.on("room:leave", (data: { roomId: string }) => {
        try {
            const room = roomManager.getRoom(data.roomId);
            roomManager.leaveRoom(data.roomId, socket.id);
            socket.leave(data.roomId);
            socket.emit("room:left", { success: true });
            socket.to(data.roomId).emit("player:left", { playerId: socket.id, room: roomManager.getRoomInfo(data.roomId) });
            const filteredRooms = roomManager.listRooms().filter((r) => r.gameType === room?.gameType);
            io.emit("rooms:list", { gameType: room?.gameType, rooms: filteredRooms });
        } catch (err) {
            logger.error("Error leaving room", { error: err });
            socket.emit("room:error", { message: "Failed to leave room" });
        }
    });

    // Host starts match within room
    socket.on("room:start", async (data: { roomId: string }) => {
        try {
            const roomInfo = roomManager.getRoomInfo(data.roomId);
            if (!roomInfo) { socket.emit("room:error", { message: "Room not found" }); return; }

            // Non-chess games use match:started
            if (roomInfo.gameType !== "chess") {
                io.to(data.roomId).emit("match:started");
                return;
            }

            const room = roomManager.getRoom(data.roomId);
            if (!room || room.players.size < 2) {
                socket.emit("room:error", { message: "Need 2 players to start" });
                return;
            }

            const [hostSocketId, guestSocketId] = Array.from(room.players);

            // Resolve userIds from socket IDs
            const hostSocket = io.sockets.sockets.get(hostSocketId);
            const guestSocket = io.sockets.sockets.get(guestSocketId);

            const hostUserId = hostSocket?.data?.userId;
            const guestUserId = guestSocket?.data?.userId;

            if (!hostUserId || !guestUserId) {
                logger.warn("User IDs missing", {
                    hostSocketId,
                    guestSocketId,
                    hostUserId,
                    guestUserId,
                });

                socket.emit("room:error", {
                    message: "Players not registered properly",
                });
                return;
            }

            if (!hostUserId || !guestUserId) {
                socket.emit("room:error", { message: "Could not resolve player IDs" });
                return;
            }

            const timeControl = "10+0";

            // Create chess game — host is white, guest is black
            const game = await chessService.startGame(
                { blackPlayerId: guestUserId, timeControl },
                hostUserId,
            );

            // Emit chess:gameStart to each player with their color
            io.to(hostSocketId).emit("chess:gameStart", {
                gameId: game.game_id,
                playerColor: "w",
                timeControl: game.white_time_left / 1000,
            });

            io.to(guestSocketId).emit("chess:gameStart", {
                gameId: game.game_id,
                playerColor: "b",
                timeControl: game.black_time_left / 1000,
            });

            logger.info(`Chess game ${game.game_id} started in room ${data.roomId}`);
        } catch (err) {
            logger.error("Error starting match", { error: err });
            socket.emit("room:error", { message: "Failed to start match" });
        }
    });

    socket.on("rooms:get", (data?: { gameType?: "tictactoe" | "snake" | "rps" | "chess" }) => {
        const filteredRooms = roomManager.listRooms().filter((room) =>
            data?.gameType ? room.gameType === data.gameType : true,
        );
        socket.emit("rooms:list", { gameType: data?.gameType, rooms: filteredRooms });
    });

    socket.on("room:get", (data: { roomId: string }) => {
        const roomInfo = roomManager.getRoomInfo(data.roomId);
        if (roomInfo) { socket.emit("room:info", roomInfo); }
        else { socket.emit("room:error", { message: "Room not found" }); }
    });
}

