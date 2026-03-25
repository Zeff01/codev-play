import { Button } from "../ui/button";

type CellProps = {
  value: "X" | "O" | null;
  onClick: () => void;
};

export function Cell({ value, onClick }: CellProps) {
  return (
    <Button variant="outline" className="h-20 w-20 text-4xl font-bold" onClick={onClick} disabled={!!value}>
      {value}
    </Button>
  );
}
