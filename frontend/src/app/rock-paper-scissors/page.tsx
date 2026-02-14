import ChoiceSection from "@/components/rock-paper-scissors/ChoiceSection";
import ResultDisplay from "@/components/rock-paper-scissors/ResultDisplay";
import ScoreBoard from "@/components/rock-paper-scissors/ScoreBoard";

export default function Page() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-6 bg-[#282357] text-white">
            <h1 className="text-3xl font-bold">Rock Paper Scissors</h1>

            <ChoiceSection />
            <ResultDisplay />
            <ScoreBoard />
        </main>
    );
}
