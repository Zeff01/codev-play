import { Room, RoomInfo } from "@/types/room.type";

export class RoomManager {
  private rooms: Map<string, Room> = new Map();

  createRoom(hostId: string, roomName?: string, gameType?: "tictactoe" | "snake" | "rps"): Room {
    const roomId = this.generateRoomId();
    const room: Room = {
      id: roomId,
      name: roomName || `Room ${roomId}`,
      players: new Set([hostId]),
      createdAt: new Date(),
      gameType,
    };
    this.rooms.set(roomId, room);
    return room;
  }

  joinRoom(roomId: string, playerId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;
    room.players.add(playerId);
    return true;
  }

  leaveRoom(roomId: string, playerId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) return;
    room.players.delete(playerId);

    // Delete room if empty
    if (room.players.size === 0) {
      this.rooms.delete(roomId);
    }
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  getRoomInfo(roomId: string): RoomInfo | undefined {
    const room = this.rooms.get(roomId);
    if (!room) return undefined;

    return {
      id: room.id,
      name: room.name,
      playerCount: room.players.size,
      players: Array.from(room.players),
      createdAt: room.createdAt,
      gameType: room.gameType,
      gameId: room.gameId,
    };
  }

  listRooms(): RoomInfo[] {
    return Array.from(this.rooms.values()).map((room) => ({
      id: room.id,
      name: room.name,
      playerCount: room.players.size,
      players: Array.from(room.players),
      createdAt: room.createdAt,
      gameType: room.gameType,
      gameId: room.gameId,
    }));
  }

  getPlayerRoom(playerId: string): Room | undefined {
    console.log(this.rooms.values());
    for (const room of this.rooms.values()) {
      if (room.players.has(playerId)) {
        return room;
      }
    }
    return undefined;
  }

  private generateRoomId(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  setGameId(roomId: string, gameId: string): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;
    room.gameId = gameId;
    return true;
  }

  setGameState(roomId: string, gameState: any): boolean {
    const room = this.rooms.get(roomId);
    if (!room) return false;
    room.gameState = gameState;
    return true;
  }
}
