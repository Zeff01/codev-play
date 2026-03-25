import type { Choice, RoundResult } from "@/types/rps";

const CHOICES: Choice[] = ["rock", "paper", "scissors"];

export function randomChoice(): Choice {
    return CHOICES[Math.floor(Math.random() * 3)];
}

export function getResult(player: Choice, opponent: Choice): RoundResult {
    if (player === opponent) return "draw";
    if (
        (player === "rock" && opponent === "scissors") ||
        (player === "paper" && opponent === "rock") ||
        (player === "scissors" && opponent === "paper")
    )
        return "win";
    return "lose";
}
