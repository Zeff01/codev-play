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
import { useAuth } from "./AuthContext";

type SocketContextType = {
    socket: Socket | null;
    socketId: string | null;
    isConnected: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rooms: any[];
};

const SocketContext = createContext<SocketContextType>({
    socket: null,
    socketId: null,
    isConnected: false,
    rooms: [],
});

export function SocketProvider({ children }: { children: ReactNode }) {
    const user = useAuth();
    const socketRef = useRef<Socket | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [socketId, setSocketId] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [rooms, setRooms] = useState<any[]>([]);
    
    
    useEffect(() => {

        console.log("Attempting socket connection, user:", user);
        if (!user.user?.id) {
            console.log("No user id yet, skipping socket connection");
            return;
        }

        socketRef.current = io(process.env.NEXT_PUBLIC_API_URL!, {
            transports: ["websocket"],
            query:{
                userId: user.user?.id,
            }

            
        })

        const handleConnect = () => {
            setSocket(socketRef.current);
            setIsConnected(true);
            setSocketId(socketRef.current?.id || null);
        };

        const handleDisconnect = () => {
            setIsConnected(false);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleRoomsList = (data: { gameType?: string; rooms: any[] }) => {
            setRooms(data.rooms || []);
        };

        socketRef.current.on("connect", handleConnect);
        socketRef.current.on("disconnect", handleDisconnect);
        socketRef.current.on("rooms:list", handleRoomsList);

        socketRef.current.on("room:created", (data) => {
            console.log("Room created in frontend:", data);
        });

        socketRef.current.on("room:joined", (data: { roomId: string }) => {
            console.log("Room joined in frontend:", data);
        });

        return () => {
            socketRef.current?.off("connect", handleConnect);
            socketRef.current?.off("disconnect", handleDisconnect);
            socketRef.current?.off("rooms:list", handleRoomsList);
            socketRef.current?.disconnect();
            socketRef.current = null;
        };
    }, [user.user?.id]);

    const contextValue = useMemo(
        () => ({ socket, socketId, isConnected, rooms }),
        [socket, socketId, isConnected, rooms],
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
