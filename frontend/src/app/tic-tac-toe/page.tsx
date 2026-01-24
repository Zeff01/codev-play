"use client";

import { Board } from "@/components/tic-tac-toe";

export default function TicTacToePage() {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <h1 className="text-3xl font-bold">Tic Tac Toe</h1>
      <Board>
        {/* 9 empty cells */}
        {Array(9)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="h-20 w-20 border border-gray-300" />
          ))}
      </Board>
    </div>
  );
}
