"use client";

import { useEffect } from "react";
import { useRpsStore } from "@/store/rps/useRpsStore";
import type { Choice } from "@/types/rps";

const CHOICES: Choice[] = ["rock", "paper", "scissors"];

export function useGameTimer() {
    const phase = useRpsStore((s) => s.phase);
    const timer = useRpsStore((s) => s.timer);
    const tick = useRpsStore((s) => s.tick);
    const submitChoice = useRpsStore((s) => s.submitChoice);

    useEffect(() => {
        if (phase !== "choosing") return;

        const interval = setInterval(() => {
            tick();
        }, 1000);

        return () => clearInterval(interval);
    }, [phase, tick]);

    useEffect(() => {
        if (phase !== "choosing") return;
        if (timer > 0) return;

        const random = CHOICES[Math.floor(Math.random() * CHOICES.length)];

        submitChoice(random);
    }, [timer, phase, submitChoice]);
}
