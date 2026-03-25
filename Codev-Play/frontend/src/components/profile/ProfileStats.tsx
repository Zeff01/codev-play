import StatCard from "./StatCard";
import { Zap, Trophy, Flame } from "lucide-react";

interface ProfileStatsProps {
    stats: {
        points: number;
        rank: string | number;
        streak: number;
    };
}

export default function ProfileStats({ stats }: ProfileStatsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon={Zap} label="Points" value={stats.points} />
            <StatCard icon={Trophy} label="Rank" value={stats.rank} />
            <StatCard
                icon={Flame}
                label="Streak"
                value={`${stats.streak} days`}
            />
        </div>
    );
}
