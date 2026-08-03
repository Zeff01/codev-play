import { Server, Socket } from "socket.io";
import { RoomManager } from "@/utils/room-manager";
import logger from "@/utils/logger";
import { getUserIdFromSocket,userSocketMap,socketUserMap } from "../socket-server";
import {ChessService} from "@/services/chess/chess.services";
import { GameDisconnectHandler } from "@/services/chess/chess.disconnecthandler";
import { ChessModel } from "@/models/chess.model";
import { ChessSocket } from "@/sockets/chess.socket";
export function registerDisconnectEvents(
    io: Server,
    socket: Socket,
    roomManager: RoomManager,
) {
    socket.on("disconnect", (reason) => {
        logger.info(`User ${socket.id} disconnected`, { reason });

        const userId = getUserIdFromSocket(socket.id);
        if (userId) {
            userSocketMap.delete(userId);
        }
            socketUserMap.delete(socket.id);
        // Find and leave any room the player was in
        const playerRoom = roomManager.getPlayerRoom(socket.id);
        if (playerRoom) {
            roomManager.leaveRoom(playerRoom.id, socket.id);

            // Notify others in the room
            socket.to(playerRoom.id).emit("player:left", {
                playerId: socket.id,
                room: roomManager.getRoomInfo(playerRoom.id),
            });

            // Broadcast updated room list filtered by game type
            const filteredRooms = roomManager
                .listRooms()
                .filter((r) => r.gameType === playerRoom.gameType);
            io.emit("rooms:list", {
                gameType: playerRoom.gameType,
                rooms: filteredRooms,
            });
        if (playerRoom.gameType === "chess" && playerRoom.gameId && userId) {
            const gameDisconnect = new GameDisconnectHandler(
                                io,
                                new ChessService(new ChessSocket(), new ChessModel()), // <-- new ChessService(...), not bare ChessService
                                new ChessModel(),
                                new ChessSocket()
            );
            gameDisconnect.handleDisconnect(playerRoom.gameId, Number(userId));
        }
        }
    });

    socket.on("error", (err) => {
        logger.error("Socket Error", { error: err });
    });
}
