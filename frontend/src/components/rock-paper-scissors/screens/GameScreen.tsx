"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useRpsStore } from "@/store/rps/useRpsStore";
import ChoiceSection from "@/components/rock-paper-scissors/game/ChoiceSection";
import ResultDisplay from "@/components/rock-paper-scissors/game/ResultDisplay";
import ScoreBoard from "@/components/rock-paper-scissors/game/ScoreBoard";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Users } from "lucide-react";
import { useGameTimer } from "@/hooks/rps/useGameTimer";

export default function GameScreen() {
    const params = useParams();
    const gameId = params?.gameId as string;

    const {
        phase,
        playerChoice,
        submitChoice,
        currentRound,
        winnerId,
        nextRound,
        reset,
        bestOf,
        mode,
        score,
        history,
        winsNeeded,
        startVsCpu,
        roomId,
        setRoomId,
        timer,
    } = useRpsStore();

    const isOnline = gameId !== "cpu";

    useEffect(() => {
        if (!gameId) return;

        if (gameId === "cpu" && phase === "idle") {
            startVsCpu();
            return;
        }

        if (gameId !== "cpu" && roomId !== gameId) {
            setRoomId(gameId);
        }
    }, [gameId, phase, roomId, startVsCpu, setRoomId]);

    useGameTimer();

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
                        phase={phase}
                        playerChoice={playerChoice}
                        onChoice={submitChoice}
                        timer={timer}
                    />

                    <ResultDisplay
                        phase={phase}
                        currentRound={currentRound}
                        winnerId={winnerId}
                        onNextRound={nextRound}
                        onReset={reset}
                        bestOf={bestOf}
                        mode={mode}
                    />

                    <ScoreBoard
                        score={score}
                        history={history}
                        mode={mode}
                        winsNeeded={winsNeeded}
                        bestOf={bestOf}
                        onReset={reset}
                    />
                </CardContent>
            </Card>
        </main>
    );
}
