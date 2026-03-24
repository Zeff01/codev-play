"use client";

import { useState } from "react";
import { useChessStore } from "@/store/chess/useChessStore";
import { useChessSocket } from "@/hooks/chess/useChessSocket";
import { Button } from "@/components/ui/button";

export default function IdleScreen() {
  const setPhase = useChessStore((s) => s.setPhase);
  const { createRoom, getRooms } = useChessSocket();
  const [timeControl, setTimeControl] = useState(600);

  const timeOptions = [
    { label: "3 min", value: 180 },
    { label: "5 min", value: 300 },
    { label: "10 min", value: 600 },
    { label: "15 min", value: 900 },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-6 p-8">
      <div className="text-center space-y-2">
        <div className="text-6xl mb-4" aria-hidden="true">
          ♟
        </div>
        <h1 className="font-outfit text-4xl font-bold tracking-tight">Chess</h1>
        <p className="text-muted-foreground font-roboto text-sm">
          Play chess with your Codev friends.
        </p>
      </div>

      {/* Time control selector */}
      <div className="flex gap-2 flex-wrap justify-center">
        {timeOptions.map((opt) => (
          <Button
            key={opt.value}
            variant={timeControl === opt.value ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeControl(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => {
            getRooms();
            setPhase("lobby");
          }}
        >
          Find a Game
        </Button>

        <Button
          variant="outline"
          onClick={() => {
            createRoom(timeControl);
          }}
        >
          Create Room
        </Button>
      </div>
    </div>
  );
}
