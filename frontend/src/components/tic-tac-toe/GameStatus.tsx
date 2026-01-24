import { motion } from "framer-motion";

type GameStatusProps = {
  winner: "X" | "O" | null;
  isDraw: boolean;
};

export function GameStatus({ winner, isDraw }: GameStatusProps) {
  if (winner) {
    return (
      <motion.p initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-green-600">
        Player {winner} wins
      </motion.p>
    );
  }

  if (isDraw) {
    return <p className="text-xl font-bold text-yellow-500">It's a draw!</p>;
  }

  return <p className="text-muted-foreground">Game in progress...</p>;
}
