import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";

export function LeaderboardWidget() {
  const leaders = [
    { rank: 1, name: "AlphaDev", points: 2450 },
    { rank: 2, name: "BetaTester", points: 2100 },
    { rank: 3, name: "You", points: 1850 },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <CardTitle className="text-lg">Top Players</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 mt-2">
        {leaders.map((player) => (
          <div key={player.rank} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-muted-foreground w-4">
                {player.rank}
              </span>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {player.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span
                className={`text-sm font-medium ${player.name === "You" ? "text-primary" : ""}`}
              >
                {player.name}
              </span>
            </div>
            <span className="text-sm font-bold">{player.points} pts</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
