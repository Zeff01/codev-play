import { Server, Socket } from "socket.io";
import { RoomManager } from "@/utils/room-manager";
import logger from "@/utils/logger";
import { startChessMatch } from "@/config/handlers/Startchessmatch";
import { ChessService } from "@/services/chess/chess.services";
import { ChessSocket } from "@/sockets/chess.socket";
import { ChessModel } from "@/models/chess.model";
import { getUserIdFromSocket } from "../socket-server";


const chessService = new ChessService(new ChessSocket(), new ChessModel());
export function registerRoomEvents(
    io: Server,
    socket: Socket,
    roomManager: RoomManager,
) {
    socket.on(
        "room:create",
        (data: {
            roomName?: string;
            gameType?: "tictactoe" | "snake" | "rps" | "chess";
        }) => {
            try {
                const room = roomManager.createRoom(
                    socket.id,
                    data?.roomName,
                    data?.gameType,
                );
                socket.join(room.id);

                socket.emit("room:created", {
                    success: true,
                    room: roomManager.getRoomInfo(room.id),
                });

                logger.info(`Created room ${room.id} for user ${socket.id}`);
                // Broadcast only to clients interested in this game type
                const filteredRooms = roomManager
                    .listRooms()
                    .filter((room) => room.gameType === data?.gameType);
                io.emit("rooms:list", {
                    gameType: data?.gameType,
                    rooms: filteredRooms,
                });
            } catch (err) {
                logger.error("Error creating room", { error: err });
                socket.emit("room:error", { message: "Failed to create room" });
            }
        },
    );

    socket.on("room:join", (data: { roomId: string }) => {
        try {
            const success = roomManager.joinRoom(data.roomId, socket.id);
            console.log("joinRoom result:", data, success);

            if (!success) {
                socket.emit("room:error", { message: "Room not found" });
                return;
            }

            socket.join(data.roomId);

            const room = roomManager.getRoom(data.roomId);
            if (room?.gameId) {
        // Game already started — only the two original players may (re)join
                const userId = getUserIdFromSocket(socket.id);
                const isOriginalPlayer = chessService
                    .fetchGame(room.gameId)
                    .then((game) => {
                        return game.whitePlayerId === userId || game.blackPlayerId === userId;
                    });
                if (!isOriginalPlayer) {
                    socket.emit("room:error", { message: "This match has already started" });
                    return;
                }
            }
            socket.emit("room:joined", {
                success: true,
                room: roomManager.getRoomInfo(data.roomId),
            });

            // Notify others in the room
            socket.to(data.roomId).emit("player:joined", {
                playerId: socket.id,
                room: roomManager.getRoomInfo(data.roomId),
            });

            // Broadcast updated room list to only this game type
            const filteredRooms = roomManager
                .listRooms()
                .filter((r) => r.gameType === room?.gameType);
            io.emit("rooms:list", {
                gameType: room?.gameType,
                rooms: filteredRooms,
            });
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

            // Notify others in the room
            socket.to(data.roomId).emit("player:left", {
                playerId: socket.id,
                room: roomManager.getRoomInfo(data.roomId),
            });

            // Broadcast updated room list to only this game type
            const filteredRooms = roomManager
                .listRooms()
                .filter((r) => r.gameType === room?.gameType);
            io.emit("rooms:list", {
                gameType: room?.gameType,
                rooms: filteredRooms,
            });
        } catch (err) {
            logger.error("Error leaving room", { error: err });
            socket.emit("room:error", { message: "Failed to leave room" });
        }
    });

    // host starts match within room
    socket.on("room:start", async (data: { roomId: string }) => {
        try {
            const roomInfo = roomManager.getRoomInfo(data.roomId);
            if (!roomInfo) {
                socket.emit("room:error", { message: "Room not found" });
                return;
            }

            if (roomInfo.gameType === "chess") {
                await startChessMatch(io, roomManager, chessService, data.roomId);
                return;
            }

            // existing behavior preserved for all other game types
            io.to(data.roomId).emit("match:started");
        } catch (err) {
            console.error("STARTMATCH ERROR:", err);
            logger.error("Error starting match", { error: err });
            socket.emit("room:error", {
                message: err instanceof Error ? err.message : "Failed to start match",
            });
        }
    });

        socket.on(
            "rooms:get",
            (data?: { gameType?: "tictactoe" | "snake" | "rps" | "chess" }) => {
                const filteredRooms = roomManager
                    .listRooms()
                    .filter((room) =>
                        data?.gameType ? room.gameType === data.gameType : true,
                    );
                socket.emit("rooms:list", {
                    gameType: data?.gameType,
                    rooms: filteredRooms,
                });
            },
        );

        socket.on("room:get", (data: { roomId: string }) => {
            const roomInfo = roomManager.getRoomInfo(data.roomId);
            if (roomInfo) {
                socket.emit("room:info", roomInfo);
            } else {
                socket.emit("room:error", { message: "Room not found" });
            }
        });
    }
