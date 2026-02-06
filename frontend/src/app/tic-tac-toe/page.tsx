"use client";

import { useEffect, useState } from "react";
import { Board, Cell, PlayerIndicator, GameStatus, ResetButton } from "@/components/tic-tac-toe";
import { useApiFetch } from "@/hooks/useApiFetch";

export default function TicTacToePage() {
  const gameId = "1";
  const [board, setBoard] = useState<(null | "X" | "O")[]>(Array(9).fill(null));
  const { data: GameData, loading, error, request } = useApiFetch();
  // const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await request(`/api/games/tictactoe/${gameId}`);
      } catch {}
    };
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-4">
      <h1 className="text-3xl font-bold">Tic Tac Toe</h1>
      {/* <GameStatus winner={winner} isDraw={isDraw} /> */}
      {/* <PlayerIndicator currentPlayer={currentPlayer} /> */}
      <Board>
        {board.map((value, i) => (
          <Cell key={i} value={value} onClick={() => console.log("clicked", i)} />
        ))}
      </Board>
      {/* <ResetButton
        onReset={() => {
          setBoard(Array(9).fill(null));
          setCurrentPlayer("X");
        }}
      /> */}
    </div>
  );
}
