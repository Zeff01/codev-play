"use client";

import { useState } from "react";
import {
    FaRegHandRock,
    FaRegHandPaper,
    FaRegHandScissors,
} from "react-icons/fa";
import ChoiceButton from "./ChoiceButton";

export default function ChoiceSection() {
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <section className="flex gap-6">
            <ChoiceButton
                icon={
                    <FaRegHandRock style={{ width: "64px", height: "64px" }} />
                }
                label="Rock"
                selected={selected === "rock"}
                onClick={() => setSelected(selected === "rock" ? null : "rock")}
            />

            <ChoiceButton
                icon={
                    <FaRegHandPaper style={{ width: "64px", height: "64px" }} />
                }
                label="Paper"
                selected={selected === "paper"}
                onClick={() =>
                    setSelected(selected === "paper" ? null : "paper")
                }
            />

            <ChoiceButton
                icon={
                    <FaRegHandScissors
                        style={{ width: "64px", height: "64px" }}
                    />
                }
                label="Scissors"
                selected={selected === "scissors"}
                onClick={() =>
                    setSelected(selected === "scissors" ? null : "scissors")
                }
            />
        </section>
    );
}
