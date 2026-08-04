"use client";

import { useState } from "react";
import { useChessStore } from "@/store/chess/useChessStore";
import { useChessGameSocket } from "@/hooks/chess/useChessGameSocket";
import ChessBoard from "@/components/chess/ChessBoard";
import MoveHistory from "@/components/chess/MoveHistory";
import GameClock from "@/components/chess/GameClock";
import GameAlerts from "@/components/chess/GameAlerts";
import DrawOfferModal from "@/components/chess/DrawOfferModal";
import { Button } from "@/components/ui/button";

// FOR Captured Pieces
import { getMaterialAdvantage } from "@/lib/chess/chess-utils";
import CapturedPieces from "@/components/chess/CapturedPieces";

// UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Props {
  gameId: string;
}

export default function GameScreen({ gameId }: Props) {
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

  // Wires the socket connection, joins the game room, and keeps the store
  // in sync with server-authoritative moves/status.
  useChessGameSocket(gameId);

  // Add this line right here!
  const material = getMaterialAdvantage(position);

  const { showDrawModal, setShowDrawModal } = useChessStore();
  const [actionError, setActionError] = useState<string | null>(null);
  const orientation = playerColor ?? "w";
  const opponentColor = orientation === "w" ? "b" : "w";

  const isGameOver =
    status === "checkmate" ||
    status === "stalemate" ||
    status === "draw" ||
    status === "resigned";

 
  const isBoardDisabled =
      isGameOver ||
      (playerColor !== null
          ? activeColor !== orientation
          : false);

  async function callChessAction(path: string) {
    setActionError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/games/chess/${gameId}/${path}`,
        {
          method: "POST",
          credentials: "include",
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || "Something went wrong");
        return null;
      }
      return data;
    } catch (err) {
      console.error(`Failed to call ${path}`, err);
      setActionError("Network error, please try again");
      return null;
    }
  }

  async function handleResign() {
    // Server response / broadcasted "chess:end" event is the source of
    // truth for both players — no local endGame() call needed here.
    await callChessAction("resign");
  }

  async function handleOfferDraw() {
    setShowDrawModal(false);
    await callChessAction("draw/offer");
  }

  async function handleAcceptDraw() {
    await callChessAction("draw/accept");
  }

  async function handleDeclineDraw() {
    await callChessAction("draw/reject");
  }

  return (
    // Main Container: Center everything, use a column on mobile, row on large screens
    <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center gap-6 p-4 lg:p-8 min-h-[calc(100vh-4rem)] w-full max-w-6xl mx-auto">
      {/* LEFT COLUMN: Players & Board */}
      <div className="flex flex-col gap-3 w-full max-w-fit">
        {/* OPPONENT TOP BAR */}
        <div className="flex items-center justify-between w-full bg-card border border-border rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-muted shadow-sm">
              <AvatarImage src="" alt="Opponent" />
              <AvatarFallback className="bg-secondary text-secondary-foreground font-outfit font-bold">
                OP
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <p className="font-outfit text-sm font-bold tracking-wide text-foreground">
                  Opponent
                </p>
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-4 font-mono font-semibold"
                >
                  1200 ELO
                </Badge>
              </div>
              <div className="h-4 mt-0.5 flex items-center text-muted-foreground text-xs">
                <CapturedPieces
                  capturedPieces={material[opponentColor].captured}
                  advantage={material[opponentColor].advantage}
                  capturedColor={opponentColor === "w" ? "b" : "w"}
                />
              </div>
            </div>
          </div>
          {/* Clock inside the bar */}
          <div className="scale-90 origin-right">
            <GameClock
              timeLeft={clocks[opponentColor]}
              isActive={
                activeColor === opponentColor &&
                !isGameOver &&
                moveHistory.length > 0
              }
              onTick={() => tickClock(opponentColor)}
              onExpire={() => endGame("checkmate")}
            />
          </div>
        </div>

        {/* THE BOARD */}
        <div className="relative flex flex-col items-center">
          <ChessBoard
            position={position}
            activeColor={activeColor}
            status={status}
            onMove={makeMove}
            validationResult={lastValidation}
            orientation={orientation}
            disabled={isBoardDisabled}
          />
        </div>

        {/* PLAYER BOTTOM BAR */}
        <div className="flex items-center justify-between w-full bg-card border border-border rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-primary shadow-sm">
              <AvatarImage src="" alt="You" />
              <AvatarFallback className="bg-primary/10 text-primary font-outfit font-bold">
                ME
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <p className="font-outfit text-sm font-bold tracking-wide text-foreground">
                  You
                </p>
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 h-4 border-primary/50 text-primary font-mono font-semibold"
                >
                  1200 ELO
                </Badge>
              </div>
              <div className="h-4 mt-0.5 flex items-center text-muted-foreground text-xs">
                <CapturedPieces
                  capturedPieces={material[orientation].captured}
                  advantage={material[orientation].advantage}
                  capturedColor={orientation === "w" ? "b" : "w"}
                />
              </div>
            </div>
          </div>
          {/* Clock inside the bar */}
          <div className="scale-90 origin-right">
            <GameClock
              timeLeft={clocks[orientation]}
              isActive={
                activeColor === orientation &&
                !isGameOver &&
                moveHistory.length > 0
              }
              onTick={() => tickClock(orientation)}
              onExpire={() => endGame("resigned")}
            />
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Sidebar (Move History & Actions) */}
      <div className="flex flex-col gap-4 w-full max-w-sm xl:w-80 h-full">
        <div className="w-full">
          <GameAlerts status={status} activeColor={activeColor} />
          {actionError && (
            <p className="text-xs text-destructive mt-1">{actionError}</p>
          )}
        </div>
        <div className="h-[250px] xl:h-[450px] w-full flex">
          <MoveHistory moves={moveHistory} />
        </div>

        {/* Game Controls */}
        <div className="flex gap-3 w-full bg-card p-3 rounded-lg border border-border shadow-sm">
          {!isGameOver ? (
            <>
              <Button
                variant="outline"
                className="flex-1 font-outfit font-semibold tracking-wide"
                onClick={handleOfferDraw}
              >
                Offer Draw
              </Button>
              <Button
                variant="destructive"
                className="flex-1 font-outfit font-semibold tracking-wide"
                onClick={handleResign}
              >
                Resign
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              className="w-full font-outfit font-bold tracking-widest uppercase"
              onClick={reset}
            >
              Play Again / Lobby
            </Button>
          )}
        </div>
      </div>

      {showDrawModal && (
        <DrawOfferModal
          onAccept={handleAcceptDraw}
          onDecline={handleDeclineDraw}
        />
      )}
    </div>
  );
}