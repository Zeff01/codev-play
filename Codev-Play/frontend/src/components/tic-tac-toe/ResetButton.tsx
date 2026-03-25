import { Button } from "../ui/button";

type ResetButtonProps = {
  onReset: () => void;
};

export function ResetButton({ onReset }: ResetButtonProps) {
  return (
    <Button variant="destructive" onClick={onReset}>
      Reset Game
    </Button>
  );
}
