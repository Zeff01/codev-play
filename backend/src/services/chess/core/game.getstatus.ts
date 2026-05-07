import { Chess } from "chess.js";
import { GameStatusResult, GameStatus } from "../types/chess.types";

export default function getGameStatus(
    engine: Chess,
    isTimeout: boolean = false,
    timedOutPlayer: "w" | "b" | null = null
): GameStatusResult {

    // ❗ SAFETY: engine must always be valid
    if (!engine) {
        return {
            winner: null,
            reason: "ongoing",
            isDraw: false,
        };
    }

    // -------------------------
    // ⏱ TIMEOUT HANDLING
    // -------------------------
    if (isTimeout && timedOutPlayer) {
        const winner: "white" | "black" =
            timedOutPlayer === "w" ? "black" : "white";

        const insufficientMaterial = engine.isInsufficientMaterial();

        return {
            winner: insufficientMaterial ? null : winner,
            reason: insufficientMaterial
                ? "timeout_with_insufficient_material"
                : "timeout",
            isDraw: insufficientMaterial,
        };
    }

    // -------------------------
    // 🚨 CHECKMATE
    // -------------------------
    if (engine.isCheckmate()) {
        return {
            winner: engine.turn() === "w" ? "black" : "white",
            reason: "checkmate",
            isDraw: false,
        };
}

    // -------------------------
    // 🤝 DRAW CONDITIONS
    // -------------------------
    if (engine.isDraw()) {
        let reason: GameStatus = "draw";

        if (engine.isStalemate()) reason = "stalemate";
        else if (engine.isThreefoldRepetition()) reason = "repetition";
        else if (engine.isInsufficientMaterial())
            reason = "insufficient_material";
        else reason = "50_move_rule";

        return {
            winner: null,
            reason,
            isDraw: true,
        };
    }

    // -------------------------
    // ♟ NORMAL GAME STATE
    // -------------------------
    return {
        winner: null,
        reason: "ongoing",
        isDraw: false,
    };
}