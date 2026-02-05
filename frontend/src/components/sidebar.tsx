import Link from "next/link";
import { Button } from "./ui/button";

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r p-4 gap-2">
      <h2 className="text-lg font-semibold mb-4">Sidebar</h2>

      <Button variant="ghost" asChild>
        <Link href="#">Dashboard</Link>
      </Button>

      <Button variant="ghost" asChild>
        <Link href="#">Game 1</Link>
      </Button>

      <Button variant="ghost" asChild>
        <Link href="#">Game 2</Link>
      </Button>
    </aside>
  );
}
