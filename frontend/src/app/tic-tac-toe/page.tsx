"use client";

import { Board, Cell, PlayerIndicator } from "@/components/tic-tac-toe";
import { useState } from "react";

export default function TicTacToePage() {
  const [board, setBoard] = useState<(null | "X" | "O")[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");

  const handleClick = (i: number) => {
    const newBoard = [...board];
    if (!newBoard[i]) {
      newBoard[i] = currentPlayer;
      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <h1 className="text-3xl font-bold">Tic Tac Toe</h1>
      <PlayerIndicator currentPlayer={currentPlayer} />
      <Board>
        {board.map((value, i) => (
          <Cell key={i} value={value} onClick={() => handleClick(i)} />
        ))}
      </Board>
    </div>
  );
}
