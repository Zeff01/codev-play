"use client";

import { useRpsStore } from "@/store/useRpsStore";
import ChoiceSection from "@/components/rock-paper-scissors/ChoiceSection";
import ResultDisplay from "@/components/rock-paper-scissors/ResultDisplay";
import ScoreBoard from "@/components/rock-paper-scissors/ScoreBoard";

export default function Page() {
    const game = useRpsStore();

    if (game.phase === "idle") {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-6 bg-[#282357] text-white">
                <h1 className="text-3xl font-bold tracking-tight">
                    Rock Paper Scissors
                </h1>
                <p className="text-purple-300 text-sm uppercase tracking-widest">
                    Choose a mode
                </p>

                <div className="flex gap-6">
                    <button
                        onClick={() => game.startVsCpu()}
                        className="flex flex-col items-center justify-center gap-3 w-40 h-40 rounded-2xl bg-[#39327C] border-2 border-white/10 hover:border-purple-400 hover:bg-[#4b43a6] transition-all duration-200 cursor-pointer"
                    >
                        <span className="text-4xl">🤖</span>
                        <span className="text-sm font-semibold">vs CPU</span>
                        <span className="text-[10px] text-purple-300 text-center leading-tight">
                            Play alone
                            <br />
                            against the bot
                        </span>
                    </button>

                    <button
                        onClick={() => game.startOnline()}
                        className="flex flex-col items-center justify-center gap-3 w-40 h-40 rounded-2xl bg-[#39327C] border-2 border-white/10 hover:border-purple-400 hover:bg-[#4b43a6] transition-all duration-200 cursor-pointer"
                    >
                        <span className="text-4xl">🌐</span>
                        <span className="text-sm font-semibold">Online</span>
                        <span className="text-[10px] text-purple-300 text-center leading-tight">
                            Play against
                            <br />a real person
                        </span>
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-6 bg-[#282357] text-white">
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">
                    Rock Paper Scissors
                </h1>
                <span className="text-xs text-purple-400 border border-purple-500/40 rounded-full px-2 py-0.5">
                    {game.mode === "online" ? "🌐 Online" : "🤖 vs CPU"}
                </span>
            </div>

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
        </main>
    );
}
