import { Card, CardContent } from "@/components/ui/card";

interface Achievement {
    icon: React.ComponentType<{ className?: string }>;
    name: string;
    locked: boolean;
}

export default function ProfileAchievements({
    achievements,
}: {
    achievements: Achievement[];
}) {
    return (
        <Card className="rounded-2xl">
            <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Achievements</h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {achievements.map((a: Achievement, i: number) => {
                        const Icon = a.icon;

                        return (
                            <div
                                key={i}
                                className={`flex flex-col items-center justify-center rounded-xl border p-4 text-center transition ${
                                    a.locked
                                        ? "opacity-40 border-dashed"
                                        : "hover:border-primary/40 hover:bg-primary/5"
                                }`}
                            >
                                <Icon className="w-6 h-6 mb-2 text-primary" />
                                <p className="text-xs font-medium">{a.name}</p>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
