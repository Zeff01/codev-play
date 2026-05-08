"use client";

import { useEffect } from "react";
import { useSocketContext } from "@/context/SocketContext";
import { useChessStore } from "@/store/chess/useChessStore";

// Call this once at the top of each chess screen
// Wires the shared socket from SocketContext into the chess Zustand store
export function useChessSocket() {
    const { socket } = useSocketContext();
    const setSocket = useChessStore((s) => s.setSocket);
    const storeSocket = useChessStore((s) => s.socket);

    useEffect(() => {
        if (!socket) return;
        if (storeSocket === socket) return; // already set, don't re-register listeners
        console.log("setSocket called");
        setSocket(socket);
    }, [socket, setSocket, storeSocket]);
}