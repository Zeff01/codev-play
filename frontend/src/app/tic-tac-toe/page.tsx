"use client";

import { useState } from "react";
import { Board, Cell, PlayerIndicator, GameStatus, ResetButton } from "@/components/tic-tac-toe";

export default function TicTacToePage() {
  const [board, setBoard] = useState<(null | "X" | "O")[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");

  function checkWinner(board: (null | "X" | "O")[]): "X" | "O" | null {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return null;
  }

  const winner = checkWinner(board);
  const isDraw = !winner && board.every(Boolean);

  const handleClick = (i: number) => {
    if (winner || board[i]) {
      return;
    }

    const newBoard = [...board];
    newBoard[i] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-4">
      <h1 className="text-3xl font-bold">Tic Tac Toe</h1>
      <GameStatus winner={winner} isDraw={isDraw} />
      <PlayerIndicator currentPlayer={currentPlayer} />
      <Board>
        {board.map((value, i) => (
          <Cell key={i} value={value} onClick={() => handleClick(i)} />
        ))}
      </Board>
      <ResetButton
        onReset={() => {
          setBoard(Array(9).fill(null));
          setCurrentPlayer("X");
        }}
      />
    </div>
  );
}
