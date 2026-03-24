"use client";

import { useState, useCallback } from "react";
import { useChessStore } from "@/store/chess/useChessStore";
import { useChessSocket } from "@/hooks/chess/useChessSocket";
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

export default function GameScreen() {
  const {
    position,
    activeColor,
    status,
    moveHistory,
    lastValidation,
    playerColor,
    clocks,
    roomId,
    isOnline,
    opponentConnected,
    drawOfferedBy,
    rematchRequestedBy,
    playerId,
    makeMove,
    tickClock,
    endGame,
    reset,
  } = useChessStore();

  const {
    sendMove,
    offerDraw,
    respondDraw,
    resign,
    requestRematch,
    respondRematch,
  } = useChessSocket();

  // Add this line right here!
  const material = getMaterialAdvantage(position);

  const [showDrawModal, setShowDrawModal] = useState(false);
  const orientation = playerColor ?? "w";
  const opponentColor = orientation === "w" ? "b" : "w";

  const isGameOver =
    status === "checkmate" ||
    status === "stalemate" ||
    status === "draw" ||
    status === "resigned";

  // In online mode, disable board when:
  //   1. It's not the player's turn
  //   2. Game is over
  // In local mode, only disable when game is over
  const isBoardDisabled = isOnline
    ? isGameOver || activeColor !== playerColor
    : isGameOver;

  // ── Move handler: local OR online ──
  const handleMove = useCallback(
    (from: string, to: string, promotion?: string) => {
      if (isOnline && roomId) {
        // Online: emit to server, don't apply locally
        sendMove(roomId, from, to, promotion);
      } else {
        // Local: apply immediately via store
        makeMove(from, to, promotion);
      }
    },
    [isOnline, roomId, sendMove, makeMove],
  );

  // ── Draw handling ──
  const handleOfferDraw = () => {
    if (isOnline && roomId) {
      offerDraw(roomId);
      setShowDrawModal(true);
    } else {
      setShowDrawModal(true);
    }
  };

  const handleAcceptDraw = () => {
    if (isOnline && roomId) {
      respondDraw(roomId, true);
    } else {
      endGame("draw");
    }
    setShowDrawModal(false);
  };

  const handleDeclineDraw = () => {
    if (isOnline && roomId) {
      respondDraw(roomId, false);
    }
    setShowDrawModal(false);
  };

  // ── Resign handling ──
  const handleResign = () => {
    if (isOnline && roomId) {
      resign(roomId);
    } else {
      endGame("resigned");
    }
  };

  // ── Rematch / Play Again handling ──
  const handlePlayAgain = () => {
    if (isOnline && roomId) {
      requestRematch(roomId);
    } else {
      reset();
    }
  };

  // ── Determine if draw modal should show as recipient ──
  const isDrawRecipient = isOnline && drawOfferedBy !== null && drawOfferedBy !== playerId;
  const showDrawFromOpponent = isDrawRecipient && !showDrawModal;

  return (
    // Main Container
    <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center gap-6 p-4 lg:p-8 min-h-[calc(100vh-4rem)] w-full max-w-6xl mx-auto">
      {/* LEFT COLUMN: Players & Board */}
      <div className="flex flex-col gap-3 w-full max-w-fit">
        {/* Opponent disconnected banner */}
        {isOnline && !opponentConnected && !isGameOver && (
          <div className="w-full bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-center">
            <p className="font-roboto text-sm text-destructive font-medium">
              ⚠ Opponent disconnected. They have 30 seconds to reconnect.
            </p>
          </div>
        )}

        {/* Rematch request banner */}
        {rematchRequestedBy && rematchRequestedBy !== playerId && (
          <div className="w-full bg-primary/10 border border-primary/30 rounded-lg p-3 flex items-center justify-between">
            <p className="font-roboto text-sm text-primary font-medium">
              Opponent wants a rematch!
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => roomId && respondRematch(roomId, true)}
              >
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => roomId && respondRematch(roomId, false)}
              >
                Decline
              </Button>
            </div>
          </div>
        )}

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
                {isOnline && (
                  <div
                    className={`w-2 h-2 rounded-full ${
                      opponentConnected ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                )}
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
            onMove={handleMove}
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
              onClick={handlePlayAgain}
            >
              {isOnline ? "Request Rematch" : "Play Again / Lobby"}
            </Button>
          )}
        </div>
      </div>

      {/* Draw offer modal — sent by this player */}
      {showDrawModal && (
        <DrawOfferModal
          isRecipient={false}
          onAccept={handleAcceptDraw}
          onDecline={handleDeclineDraw}
        />
      )}

      {/* Draw offer modal — received from opponent */}
      {showDrawFromOpponent && (
        <DrawOfferModal
          isRecipient={true}
          onAccept={handleAcceptDraw}
          onDecline={handleDeclineDraw}
        />
      )}
    </div>
  );
}
