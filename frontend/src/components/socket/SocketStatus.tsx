"use client";

import { useSocketContext } from "@/lib/socket/SocketContext";

export function SocketStatus() {
  const { isConnected } = useSocketContext();

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
      <span>{isConnected ? "Connected" : "Disconnected"}</span>
    </div>
  );
}
