import { Button } from "./ui/button";
import { ModeToggle } from "./ui/ModeToggle";

export function Header() {
  return (
    <header className="h-14 border-b px-4 flex items-center justify-between">
      <h1 className="font-medium text-lg">LOGO</h1>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <Button size="sm" variant="outline">
          Profile
        </Button>
      </div>
    </header>
  );
}
