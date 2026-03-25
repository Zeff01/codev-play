import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Swords, XCircle, Percent } from "lucide-react";

export function StatsOverview() {
  // Mock data - iko-connect natin 'to sa Zustand o API niyo later
  const stats = [
    {
      title: "Total Games",
      value: "2",
      icon: Swords,
      color: "text-blue-500",
    },
    { title: "Wins", value: "1", icon: Trophy, color: "text-green-500" },
    { title: "Losses", value: "1", icon: XCircle, color: "text-red-500" },
    {
      title: "Win Rate",
      value: "50%",
      icon: Percent,
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="transition-all hover:scale-105 duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
