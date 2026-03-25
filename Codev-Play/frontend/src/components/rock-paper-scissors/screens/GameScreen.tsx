"use client";

import { useRpsStore } from "@/store/rps/useRpsStore";
import ChoiceSection from "@/components/rock-paper-scissors/game/ChoiceSection";
import ResultDisplay from "@/components/rock-paper-scissors/game/ResultDisplay";
import ScoreBoard from "@/components/rock-paper-scissors/game/ScoreBoard";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Users } from "lucide-react";

export default function GameScreen() {
    const game = useRpsStore();

    const isOnline = game.mode === "online";

    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
            <Card className="w-full max-w-5xl shadow-xl dark:bg-[#282357] dark:border-purple-400/30">
                <CardHeader className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-3">
                        <CardTitle className="text-3xl">
                            Rock Paper Scissors
                        </CardTitle>

                        <Badge
                            variant="secondary"
                            className="flex items-center gap-1 dark:bg-purple-500/20 dark:text-purple-200 dark:border-purple-400/30"
                        >
                            {isOnline ? (
                                <>
                                    <Users className="h-3 w-3" />
                                    Online
                                </>
                            ) : (
                                <>
                                    <Bot className="h-3 w-3" />
                                    vs CPU
                                </>
                            )}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-8 flex items-center flex-col">
                    <ChoiceSection
                        phase={game.phase}
                        playerChoice={game.playerChoice}
                        onChoice={game.submitChoice}
                    />

                    <ResultDisplay
                        phase={game.phase}
                        currentRound={game.currentRound}
                        winnerId={game.winnerId}
                        onNextRound={game.nextRound}
                        onReset={game.reset}
                        bestOf={game.bestOf}
                        mode={game.mode}
                    />

                    <ScoreBoard
                        score={game.score}
                        history={game.history}
                        mode={game.mode}
                        winsNeeded={game.winsNeeded}
                        bestOf={game.bestOf}
                        onReset={game.reset}
                    />
                </CardContent>
            </Card>
        </main>
    );
}
