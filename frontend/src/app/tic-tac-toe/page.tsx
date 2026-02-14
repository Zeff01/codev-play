"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Board, Cell, PlayerIndicator, GameStatus, ResetButton } from "@/components/tic-tac-toe";
import { useApiFetch } from "@/hooks/useApiFetch";
import { ticTacToeService } from "@/services/games/ticTacToeService";

export default function TicTacToePage() {
  const [board, setBoard] = useState<(null | "X" | "O")[]>(Array(9).fill(null));
  const [activeGames, setActiveGames] = useState<any[]>([]);
  const { data: GameData, loading, error, request } = useApiFetch();
  // const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");

  useEffect(() => {
    fetchActiveGames();
  }, []);

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
      return;
    }
    console.log(result);
    setActiveGames(result);
  };

  return (
    <div className="flex flex-col items-center  min-h-screen p-4 gap-4">
      <h1 className="text-3xl font-bold">Tic Tac Toe</h1>
      <Button onClick={handleCreateGame}>Create Game</Button>

      {activeGames.length > 0 && (
        <div className="w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Active Games</h2>
          <div className="space-y-4">
            {activeGames.map((game) => (
              <div key={game.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-blue-500">Game ID: {game.id}</p>
                    <p className="text-sm text-gray-600">Status: {game.status}</p>
                    <p className="text-sm text-gray-600">Created By: {game.player_x_username}</p>
                    <p className="text-sm text-gray-600">Current Player: {game.current_player}</p>
                  </div>
                </div>
                <Button className="mt-3" size="sm" onClick={() => console.log("Join game:", game.id)}>
                  Join Game
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

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
