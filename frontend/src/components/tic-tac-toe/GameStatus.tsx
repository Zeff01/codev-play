type GameStatusProps = {
  winner: "X" | "O" | null;
  isDraw: boolean;
};

export function GameStatus({ winner, isDraw }: GameStatusProps) {
  if (winner) {
    return <p className="text-xl font-bold text-green-600"> Player {winner} wins</p>;
  }

  if (isDraw) {
    return <p className="text-xl font-bold text-yellow-500">It's a draw!</p>;
  }

  return <p className="text-muted-foreground">Game in progress...</p>;
}
