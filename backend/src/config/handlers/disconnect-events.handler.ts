import { Server, Socket } from "socket.io";
import { RoomManager } from "@/utils/room-manager";
import logger from "@/utils/logger";
import { getUserIdFromSocket } from "../socket-server";

export function registerDisconnectEvents(
    io: Server,
    socket: Socket,
    roomManager: RoomManager,
) {
    socket.on("disconnect", (reason) => {
        logger.info(`User ${socket.id} disconnected`, { reason });

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
        }
    });

    socket.on("error", (err) => {
        logger.error("Socket Error", { error: err });
    });
}
