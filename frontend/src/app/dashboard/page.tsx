import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { QuickPlay } from "@/components/dashboard/QuickPlay";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-10 w-full max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your gaming overview.
        </p>
      </div>

      {/* 1. Statistics Overview */}
      <StatsOverview />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Dito natin ilalagay yung Active Games at Game History mamaya */}
          <div className="h-64 rounded-xl border-2 border-dashed border-muted-foreground/25 flex items-center justify-center text-muted-foreground">
            Active Games & History (Coming Soon)
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* 2. Quick Play Options */}
          <QuickPlay />
          {/* Dito natin ilalagay yung LeaderboardWidget mamaya */}
        </div>
      </div>
    </div>
  );
}
