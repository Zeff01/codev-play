"use client";

import { useChessStore } from "@/store/chess/useChessStore";
import { useChessSocket } from "@/hooks/chess/useChessSocket";
import IdleScreen from "@/components/chess/screens/IdleScreen";
import LobbyScreen from "@/components/chess/screens/LobbyScreen";
import RoomScreen from "@/components/chess/screens/RoomScreen";
import GameScreen from "@/components/chess/screens/GameScreen";

export default function Page() {
  const { phase } = useChessStore();

  // Initialize chess socket listeners at the page level.
  // The hook registers all chess:* events and returns emit wrappers.
  // Screens access these via their own useChessSocket() calls.
  useChessSocket();

  if (phase === "idle") return <IdleScreen />;
  if (phase === "lobby") return <LobbyScreen />;
  if (phase === "room") return <RoomScreen />;

  return <GameScreen />;
}