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
        icon: <FaRegHandRock style={{ width: 64, height: 64 }} />,
        label: "Rock",
    },
    {
        id: "paper",
        icon: <FaRegHandPaper style={{ width: 64, height: 64 }} />,
        label: "Paper",
    },
    {
        id: "scissors",
        icon: <FaRegHandScissors style={{ width: 64, height: 64 }} />,
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
        <section className="flex flex-col items-center gap-4">
            <p className="text-sm uppercase tracking-widest text-purple-300 font-medium">
                Pick your move
            </p>
            <div className="flex gap-6">
                {CHOICES.map((choice) => {
                    const isSelected = playerChoice === choice.id;
                    return (
                        <div
                            key={choice.id}
                            className={
                                isSelected && !isRevealing
                                    ? "scale-110 transition-transform"
                                    : ""
                            }
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
                                icon={choice.icon}
                                label={choice.label}
                                selected={isSelected}
                                disabled={isLocked}
                                onClick={() => onChoice(choice.id)}
                            />
                        </div>
                    );
                })}
            </div>

            <style>{`
                @keyframes choiceShake {
                    0%   { transform: scale(1.1)  rotate(0deg);  }
                    20%  { transform: scale(1.15) rotate(-8deg); }
                    40%  { transform: scale(1.15) rotate(8deg);  }
                    60%  { transform: scale(1.15) rotate(-5deg); }
                    80%  { transform: scale(1.12) rotate(4deg);  }
                    100% { transform: scale(1.1)  rotate(0deg);  }
                }
            `}</style>
        </section>
    );
}
