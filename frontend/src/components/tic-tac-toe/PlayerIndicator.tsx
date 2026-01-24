type PlayerIndicatorProps = {
  currentPlayer: "X" | "O";
};

export function PlayerIndicator({ currentPlayer }: PlayerIndicatorProps) {
  return (
    <p className="text-lg font-semibold">
      Current Player: {""}
      <span className="text-primary">{currentPlayer}</span>
    </p>
  );
}
