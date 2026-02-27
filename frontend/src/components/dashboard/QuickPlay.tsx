import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, Scissors } from "lucide-react";
import Link from "next/link";

export function QuickPlay() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Play</CardTitle>
        <CardDescription>Jump right into the action.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {/* Naka-link 'to sa app/tic-tac-toe/page.tsx mo */}
        <Link href="/tic-tac-toe" className="w-full">
          <Button
            className="w-full flex items-center justify-center gap-2"
            size="lg"
          >
            <Gamepad2 className="w-5 h-5" />
            Play Tic-Tac-Toe
          </Button>
        </Link>

        {/* Naka-link 'to sa app/rock-paper-scissors/page.tsx mo */}
        <Link href="/rock-paper-scissors" className="w-full">
          <Button
            variant="secondary"
            className="w-full flex items-center justify-center gap-2"
            size="lg"
          >
            <Scissors className="w-5 h-5" />
            Play Rock-Paper-Scissors
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
