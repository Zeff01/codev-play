"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Globe } from "lucide-react";

export default function IdleScreen() {
    const router = useRouter();

    const startVsCpu = () => {
        router.push("/rps/game/cpu");
    };

    const startOnline = () => {
        router.push("/rps/lobby");
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-start gap-10 p-6 lg:pt-24 bg-background text-foreground">
            <header className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Rock Paper Scissors
                </h1>
                <p className="text-sm uppercase tracking-widest text-muted-foreground">
                    Choose a mode
                </p>
            </header>

            <section className="flex flex-col sm:flex-row gap-6">
                <Card
                    onClick={startVsCpu}
                    className="cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-xl border-border
          dark:bg-[#39327C] dark:border-purple-400/30 dark:hover:bg-[#4b43a6]"
                >
                    <CardContent className="flex flex-col items-center justify-center gap-3 w-40 h-40 text-center">
                        <Bot className="w-10 h-10 text-primary" />

                        <p className="text-sm font-semibold">vs CPU</p>

                        <p className="text-xs text-muted-foreground dark:text-purple-200 leading-tight">
                            Play alone <br /> against the bot
                        </p>
                    </CardContent>
                </Card>

                <Card
                    onClick={startOnline}
                    className="cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-xl border-border
          dark:bg-[#39327C] dark:border-purple-400/30 dark:hover:bg-[#4b43a6]"
                >
                    <CardContent className="flex flex-col items-center justify-center gap-3 w-40 h-40 text-center">
                        <Globe className="w-10 h-10 text-primary" />

                        <p className="text-sm font-semibold">Online</p>

                        <p className="text-xs text-muted-foreground dark:text-purple-200 leading-tight">
                            Play against <br /> a real person
                        </p>
                    </CardContent>
                </Card>
            </section>

            <Button variant="ghost" size="sm">
                Game Settings
            </Button>
        </main>
    );
}
