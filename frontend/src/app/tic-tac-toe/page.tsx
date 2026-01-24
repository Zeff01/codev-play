"use client";

import { Board, Cell } from "@/components/tic-tac-toe";
import { useState } from "react";

export default function TicTacToePage() {
  const [board, setBoard] = useState<(null | "X" | "O")[]>(Array(9).fill(null));

  const handleClick = (i: number) => {
    const newBoard = [...board];
    newBoard[i] = newBoard[i] === "X" ? "O" : "X"; // just toggles for testing
    setBoard(newBoard);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <h1 className="text-3xl font-bold">Tic Tac Toe</h1>
      <Board>
        {board.map((value, i) => (
          <Cell key={i} value={value} onClick={() => handleClick(i)} />
        ))}
      </Board>
    </div>
  );
}
