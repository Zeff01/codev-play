import { useSocketContext } from "@/context/SocketContext";

export function useSocket() {
  const { socket } = useSocketContext();

  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return socket;
}
