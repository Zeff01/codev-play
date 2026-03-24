"use client";

import { cn } from "@/lib/utils";
import {
  FaChessKing,
  FaChessQueen,
  FaChessRook,
  FaChessBishop,
  FaChessKnight,
  FaChessPawn,
} from "react-icons/fa6";

interface PieceProps {
  type: string;
  className?: string;
}

export default function Piece({ type, className }: PieceProps) {
  const isWhite = type === type.toUpperCase();
  const normalizedType = type.toLowerCase();

  const Icon = {
    k: FaChessKing,
    q: FaChessQueen,
    r: FaChessRook,
    b: FaChessBishop,
    n: FaChessKnight,
    p: FaChessPawn,
  }[normalizedType];

  if (!Icon) return null;

  return (
    <Icon
      className={cn(
        "w-full h-full transition-transform duration-200",
        // White pieces: Pure white with a solid, opaque black stroke
        isWhite
          ? "text-white drop-shadow-[-1px_-1px_0_#000] drop-shadow-[1px_-1px_0_#000] drop-shadow-[-1px_1px_0_#000] drop-shadow-[1px_1px_0_#000]"
          : // Black pieces: Pure black with a solid, opaque light-gray stroke
            "text-black drop-shadow-[-1px_-1px_0_rgba(255,255,255,0.7)] drop-shadow-[1px_-1px_0_rgba(255,255,255,0.7)] drop-shadow-[-1px_1px_0_rgba(255,255,255,0.7)] drop-shadow-[1px_1px_0_rgba(255,255,255,0.7)]",
        className,
      )}
    />
  );
}
