"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Board, Cell, PlayerIndicator, GameStatus, ResetButton } from "@/components/tic-tac-toe";
import { useApiFetch } from "@/hooks/useApiFetch";
import { ticTacToeService } from "@/services/games/ticTacToeService";

export default function TicTacToePage() {
  const [board, setBoard] = useState<(null | "X" | "O")[]>(Array(9).fill(null));
  const { data: GameData, loading, error, request } = useApiFetch();
  // const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");

  const handleCreateGame = async () => {
    const result = await ticTacToeService.createGame();
    if (!result) {
      console.error("Game creation failed");
    }
    console.log(result);
  };

  const fetchActiveGames = async () => {
    const result = await ticTacToeService.fetchActiveGames();
    if (!result) {
      console.error("Failed to fetch active games");
    }
    console.log(result);
  };

  return (
    <div className="flex flex-col items-center  min-h-screen p-4 gap-4">
      <h1 className="text-3xl font-bold">Tic Tac Toe</h1>
      <Button onClick={handleCreateGame}>Start Game</Button>
      <Button onClick={fetchActiveGames}>Fetch Active Games</Button>
      {/* <GameStatus winner={winner} isDraw={isDraw} /> */}
      {/* <PlayerIndicator currentPlayer={currentPlayer} /> */}
      {/* <Board>
        {board.map((value, i) => (
          <Cell key={i} value={value} onClick={() => console.log("clicked", i)} />
        ))}
      </Board> */}
      {/* <ResetButton
        onReset={() => {
          setBoard(Array(9).fill(null));
          setCurrentPlayer("X");
        }}
      /> */}
    </div>
  );
}
