import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function GameHistory() {
  const history = [
    {
      id: 1,
      game: "Tic-Tac-Toe",
      opponent: "NoobSlayer",
      result: "Win",
      date: "2 hrs ago",
    },
    {
      id: 2,
      game: "Rock-Paper-Scissors",
      opponent: "ProGamer",
      result: "Loss",
      date: "5 hrs ago",
    },
    {
      id: 3,
      game: "Tic-Tac-Toe",
      opponent: "ReactGod",
      result: "Draw",
      date: "1 day ago",
    },
  ];

  const getResultColor = (result: string) => {
    if (result === "Win") return "text-green-500";
    if (result === "Loss") return "text-red-500";
    return "text-yellow-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent History</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {history.map((match) => (
          <div
            key={match.id}
            className="flex items-center justify-between py-2 border-b last:border-0"
          >
            <div>
              <p className="font-medium text-sm">{match.game}</p>
              <p className="text-xs text-muted-foreground">
                vs {match.opponent} • {match.date}
              </p>
            </div>
            <p className={`font-bold text-sm ${getResultColor(match.result)}`}>
              {match.result}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
