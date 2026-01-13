"use client";

import { createContext, useContext, useEffect, useRef, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType>({ socket: null });

export function SocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ["websocket"],
      autoConnect: true,
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  return <SocketContext.Provider value={{ socket: socketRef.current }}>{children}</SocketContext.Provider>;
}

export function useSocketContext() {
  return useContext(SocketContext);
}
