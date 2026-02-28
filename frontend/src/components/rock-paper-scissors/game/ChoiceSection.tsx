"use client";

import {
    FaRegHandRock,
    FaRegHandPaper,
    FaRegHandScissors,
} from "react-icons/fa";

import ChoiceButton from "./ChoiceButton";
import { Choice, GamePhase } from "@/types/rock-paper-scissor";

const CHOICES: { id: Choice; icon: React.ReactNode; label: string }[] = [
    {
        id: "rock",
        icon: <FaRegHandRock className="w-12 h-12" />,
        label: "Rock",
    },
    {
        id: "paper",
        icon: <FaRegHandPaper className="w-12 h-12" />,
        label: "Paper",
    },
    {
        id: "scissors",
        icon: <FaRegHandScissors className="w-12 h-12" />,
        label: "Scissors",
    },
];

type Props = {
    phase: GamePhase;
    playerChoice: Choice | null;
    onChoice: (choice: Choice) => void;
};

export default function ChoiceSection({
    phase,
    playerChoice,
    onChoice,
}: Props) {
    const isLocked = phase !== "choosing";
    const isRevealing = phase === "revealing";

    return (
        <section className="flex flex-col items-center gap-6">
            {/* TITLE */}
            <p className="text-sm uppercase tracking-widest font-medium text-muted-foreground dark:text-purple-300">
                Pick your move
            </p>

            {/* CHOICES */}
            <div className="flex flex-wrap justify-center gap-6">
                {CHOICES.map((choice) => {
                    const isSelected = playerChoice === choice.id;

                    return (
                        <div
                            key={choice.id}
                            className={`
                transition-all duration-200
                ${isSelected && !isRevealing ? "scale-110" : ""}
              `}
                            style={
                                isSelected && isRevealing
                                    ? {
                                          animation:
                                              "choiceShake 0.9s ease-in-out",
                                      }
                                    : undefined
                            }
                        >
                            <ChoiceButton
                                icon={
                                    <div className="text-foreground dark:text-purple-200">
                                        {choice.icon}
                                    </div>
                                }
                                label={choice.label}
                                selected={isSelected}
                                disabled={isLocked}
                                onClick={() => onChoice(choice.id)}
                            />
                        </div>
                    );
                })}
            </div>

            {/* ANIMATION */}
            <style>{`
        @keyframes choiceShake {
          0%   { transform: scale(1.1) rotate(0deg); }
          20%  { transform: scale(1.15) rotate(-8deg); }
          40%  { transform: scale(1.15) rotate(8deg); }
          60%  { transform: scale(1.15) rotate(-5deg); }
          80%  { transform: scale(1.12) rotate(4deg); }
          100% { transform: scale(1.1) rotate(0deg); }
        }
      `}</style>
        </section>
    );
}
