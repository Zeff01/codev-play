"use client";

import { useRpsStore } from "@/store/useRpsStore";
import IdleScreen from "@/components/rock-paper-scissors/screens/IdleScreen";
import LobbyScreen from "@/components/rock-paper-scissors/screens/LobbyScreen";
import RoomScreen from "@/components/rock-paper-scissors/screens/RoomScreen";
import GameScreen from "@/components/rock-paper-scissors/screens/GameScreen";

export default function Page() {
    const { phase } = useRpsStore();

    if (phase === "idle") return <IdleScreen />;
    if (phase === "lobby") return <LobbyScreen />;
    if (phase === "room") return <RoomScreen />;

    return <GameScreen />;
}
