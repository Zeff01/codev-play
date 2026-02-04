"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

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

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  return <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>{children}</SocketContext.Provider>;
}

export function useSocketContext() {
  return useContext(SocketContext);
}
