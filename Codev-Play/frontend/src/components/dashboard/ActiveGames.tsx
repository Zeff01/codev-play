import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export function ActiveGames() {
  const activeMatches = [
    { id: 1, game: "Tic-Tac-Toe", opponent: "CodeMaster99", isMyTurn: true },
    {
      id: 2,
      game: "Rock-Paper-Scissors",
      opponent: "DevSniper",
      isMyTurn: false,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Games</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {activeMatches.map((match) => (
          <div
            key={match.id}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div>
              <p className="font-semibold text-sm">{match.game}</p>
              <p className="text-xs text-muted-foreground">
                vs {match.opponent}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={match.isMyTurn ? "default" : "secondary"}>
                {match.isMyTurn ? "Your Turn" : "Waiting"}
              </Badge>
              {match.isMyTurn && (
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <Play className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
