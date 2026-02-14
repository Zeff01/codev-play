"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  rooms: any[];
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  rooms: [],
});

export function SocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL!, {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });

    socketRef.current.on("room:created", (data) => {
      console.log("Room created in frontend:", data);
    });

    socketRef.current.on("rooms:list", (rooms) => {
      setRooms(rooms);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected, rooms }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  return useContext(SocketContext);
}
