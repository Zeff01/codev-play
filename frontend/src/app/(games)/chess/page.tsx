"use client";

import { useChessStore } from "@/store/chess/useChessStore";
import IdleScreen from "@/components/chess/screens/IdleScreen";
import LobbyScreen from "@/components/chess/screens/LobbyScreen";
import RoomScreen from "@/components/chess/screens/RoomScreen";
import GameScreen from "@/components/chess/screens/GameScreen";
import { useEffect } from "react";

export default function Page() {
    const { phase, gameId, setGameId } = useChessStore();

    useEffect(() => {
        const stored = localStorage.getItem("chess_gameId");
        if (stored && phase === "idle") {
            setGameId(stored);
            useChessStore.setState({ phase: "game" });
        }
    }, []);

    if (phase === "idle") return <IdleScreen />;
    if (phase === "lobby") return <LobbyScreen />;
    if (phase === "room") return <RoomScreen />;
    if (!gameId) return null;

    return <GameScreen gameId={gameId} />;
}