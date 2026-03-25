// src/components/dashboard/QuickPlay.tsx
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
import { AllGamesModal } from "./AllGamesModal"; // Import mo 'yung modal dito

export function QuickPlay() {
  return (
    <Card className="shadow-lg border-muted/50">
      <CardHeader>
        <CardTitle>Quick Play</CardTitle>
        <CardDescription>Jump right into the action.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {/* Hardcoded featured games for quick access */}
        <Link href="/tic-tac-toe" className="w-full">
          <Button
            className="w-full flex items-center justify-center gap-2"
            size="lg"
          >
            <Gamepad2 className="w-5 h-5" /> Play Tic-Tac-Toe
          </Button>
        </Link>

        <Link href="/rock-paper-scissors" className="w-full">
          <Button
            variant="secondary"
            className="w-full flex items-center justify-center gap-2"
            size="lg"
          >
            <Scissors className="w-5 h-5" /> Play Rock-Paper-Scissors
          </Button>
        </Link>

        <div className="mt-2 pt-2 border-t border-muted/50">
          {/* HETO ANG MAGIC: I-wrap ang button sa AllGamesModal */}
          <AllGamesModal
            trigger={
              <Button
                variant="link"
                className="w-full text-xs text-muted-foreground hover:text-orange-500"
              >
                View all 11 games available
              </Button>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
