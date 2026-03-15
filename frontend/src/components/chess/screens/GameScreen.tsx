"use client";

import { useState } from "react";
import { useChessStore } from "@/store/chess/useChessStore";
import ChessBoard from "@/components/chess/ChessBoard";
import MoveHistory from "@/components/chess/MoveHistory";
import GameClock from "@/components/chess/GameClock";
import GameAlerts from "@/components/chess/GameAlerts";
import DrawOfferModal from "@/components/chess/DrawOfferModal";
import { Button } from "@/components/ui/button";

export default function GameScreen() {
    const {
        position,
        activeColor,
        status,
        moveHistory,
        lastValidation,
        playerColor,
        clocks,
        makeMove,
        tickClock,
        endGame,
        reset,
    } = useChessStore();

    const [showDrawModal, setShowDrawModal] = useState(false);
    const orientation = playerColor ?? "w";
    const opponentColor = orientation === "w" ? "b" : "w";

    const isGameOver = status === "checkmate" || status === "stalemate" || status === "draw" || status === "resigned";
    const isBoardDisabled = isGameOver;

    // TODO: remove const isBoardDisabled = isGameOver; and replace the commented code below for player pieces constraints

    //const isBoardDisabled = playerColor !== null
    //? activeColor !== orientation || status !== "playing"
    //: status !== "playing";

    return (
        <div className="flex flex-col lg:flex-row items-start justify-center gap-4 p-4 lg:p-8 min-h-[calc(100vh-4rem)]">

            {/* Opponent panel */}
            <div className="flex flex-col gap-2 w-full lg:w-52">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                    <span className="text-2xl leading-none" aria-hidden="true">♟&#xFE0E;</span>
                    <div>
                        <p className="font-outfit text-sm font-medium leading-tight">Opponent</p>
                        <p className="font-roboto text-xs text-muted-foreground">ELO —</p>
                    </div>
                </div>
               {/* TODO: [F503 - Show opponent's time] Replace local tickClock with socket.on("chess:clockSync") */}
                <GameClock
                    timeLeft={clocks[opponentColor]}
                    isActive={activeColor === opponentColor && !isGameOver}
                    onTick={() => tickClock(opponentColor)}
                    onExpire={() => endGame("checkmate")}
                />
            </div>

            {/* Board + alerts */}
            <div className="flex flex-col items-center gap-3">
                <GameAlerts status={status} activeColor={activeColor} />
                <ChessBoard
                    position={position}
                    activeColor={activeColor}
                    status={status}
                    onMove={makeMove}
                    validationResult={lastValidation}
                    orientation={orientation}
                    disabled={isBoardDisabled}
                />
                {/* TODO: [F503 - Implement resign/draw] Wire Resign to emit("chess:resign") and Offer Draw to emit("chess:offerDraw") via socket */}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="font-roboto text-xs"
                        onClick={() => setShowDrawModal(true)}
                        disabled={isGameOver}
                    >
                        Offer Draw
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="font-roboto text-xs"
                        onClick={() => endGame("resigned")}
                        disabled={isGameOver}
                    >
                        Resign
                    </Button>
                    {isGameOver && (
                        <Button
                            variant="secondary"
                            size="sm"
                            className="font-roboto text-xs"
                            onClick={reset}
                        >
                            Back to Lobby
                        </Button>
                    )}
                </div>
            </div>

            {/* Player panel */}
            <div className="flex flex-col gap-2 w-full lg:w-52">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
                    <span className="text-2xl leading-none" aria-hidden="true">♙&#xFE0E;</span>
                    <div>
                        <p className="font-outfit text-sm font-medium leading-tight">You</p>
                        <p className="font-roboto text-xs text-muted-foreground">ELO —</p>
                    </div>
                </div>
                <GameClock
                    timeLeft={clocks[orientation]}
                    isActive={activeColor === orientation && !isGameOver}
                    onTick={() => tickClock(orientation)}
                    onExpire={() => endGame("resigned")}
                />
                <MoveHistory moves={moveHistory} />
            </div>

            {showDrawModal && (
                <DrawOfferModal
                    onAccept={() => { endGame("draw"); setShowDrawModal(false); }}
                    onDecline={() => setShowDrawModal(false)}
                />
            )}
        </div>
    );
}