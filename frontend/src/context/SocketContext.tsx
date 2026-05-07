"use client";

import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    ReactNode,
    useMemo,
} from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
    socket: Socket | null;
    socketId: string | null;
    isConnected: boolean;
    rooms: any[];
};

const SocketContext = createContext<SocketContextType>({
    socket: null,
    socketId: null,
    isConnected: false,
    rooms: [],
});

export function SocketProvider({ children }: { children: ReactNode }) {
    const socketRef = useRef<Socket | null>(null);

    const [isConnected, setIsConnected] = useState(false);
    const [socketId, setSocketId] = useState<string | null>(null);
    const [rooms, setRooms] = useState<any[]>([]);

    useEffect(() => {
        const userId =
            localStorage.getItem("userId") ||
            crypto.randomUUID();

        localStorage.setItem("userId", userId);

        const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
            transports: ["websocket"],
        });

        socketRef.current = socket;

        const handleConnect = () => {
            setIsConnected(true);
            setSocketId(socket.id ?? null);

            // register identity
            socket.emit("user:register", { userId });
        };

        const handleDisconnect = () => {
            setIsConnected(false);
        };

        const handleRoomsList = (data: { rooms: any[] }) => {
            setRooms(data.rooms || []);
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("rooms:list", handleRoomsList);

        socket.on("room:created", (data) => {
            console.log("Room created:", data);
        });

        socket.on("room:joined", (data) => {
            console.log("Room joined:", data);
        });

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("rooms:list", handleRoomsList);

            socket.disconnect();
        };
    }, []);

    const contextValue = useMemo(
        () => ({
            socket: socketRef.current,
            socketId,
            isConnected,
            rooms,
        }),
        [socketId, isConnected, rooms],
    );

    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocketContext() {
    return useContext(SocketContext);
}