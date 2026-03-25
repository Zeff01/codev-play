"use client";

import { useChessStore } from "@/store/chess/useChessStore";
import IdleScreen from "@/components/chess/screens/IdleScreen";
import LobbyScreen from "@/components/chess/screens/LobbyScreen";
import RoomScreen from "@/components/chess/screens/RoomScreen";
import GameScreen from "@/components/chess/screens/GameScreen";

export default function Page() {
    const { phase } = useChessStore();

    if (phase === "idle") return <IdleScreen />;
    if (phase === "lobby") return <LobbyScreen />;
    if (phase === "room") return <RoomScreen />;

    return <GameScreen />;
}