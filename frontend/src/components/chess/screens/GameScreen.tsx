"use client";

import { useState } from "react";
import { useChessStore } from "@/store/chess/useChessStore";
import ChessBoard from "@/components/chess/ChessBoard";
import MoveHistory from "@/components/chess/MoveHistory";
import GameClock from "@/components/chess/GameClock";
import GameAlerts from "@/components/chess/GameAlerts";
import DrawOfferModal from "@/components/chess/DrawOfferModal";
import { Button } from "@/components/ui/button";
import { useChessSocket } from "@/hooks/chess/useChessSocket";
import { getMaterialAdvantage } from "@/lib/chess/chess-utils";
import CapturedPieces from "@/components/chess/CapturedPieces";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function GameScreen() {
  useChessSocket();

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
    drawOfferedBy,
    socket,
    gameId,
  } = useChessStore();

  const material = getMaterialAdvantage(position);
  const [localDrawModal, setLocalDrawModal] = useState(false);

  const orientation = playerColor ?? "w";
  const opponentColor = orientation === "w" ? "b" : "w";

  const isGameOver =
    status === "checkmate" ||
    status === "stalemate" ||
    status === "draw" ||
    status === "resigned";

  const isBoardDisabled = playerColor !== null
    ? activeColor !== orientation || isGameOver
    : isGameOver;

  const showDrawModal = localDrawModal || drawOfferedBy !== null;
  const isRecipient = drawOfferedBy !== null && !localDrawModal;

  const handleOfferDraw = () => {
    setLocalDrawModal(true);
    if (socket && gameId) socket.emit("chess:offerDraw", { gameId });
  };

  const handleAcceptDraw = () => {
    if (socket && gameId) {
      socket.emit("chess:acceptDraw", { gameId });
    } else {
      endGame("draw");
    }
    setLocalDrawModal(false);
  };

  const handleDeclineDraw = () => {
    if (socket && gameId) socket.emit("chess:declineDraw", { gameId });
    setLocalDrawModal(false);
  };

  const handleResign = () => {
    if (socket && gameId) {
      socket.emit("chess:resign", { gameId });
    } else {
      endGame("resigned");
    }
  };

  return (
    <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center gap-6 p-4 lg:p-8 min-h-[calc(100vh-4rem)] w-full max-w-6xl mx-auto">
      {/* LEFT COLUMN */}
      <div className="flex flex-col gap-3 w-full max-w-fit">
        {/* OPPONENT BAR */}
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
                <p className="font-outfit text-sm font-bold tracking-wide text-foreground">Opponent</p>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-mono font-semibold">
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
          {/* Clocks sync from socket.on("chess:clockSync") via socketSlice */}
          <div className="scale-90 origin-right">
            <GameClock
              timeLeft={clocks[opponentColor]}
              isActive={activeColor === opponentColor && !isGameOver && moveHistory.length > 0}
              onTick={() => tickClock(opponentColor)}
              onExpire={() => endGame("checkmate")}
            />
          </div>
        </div>

        {/* BOARD */}
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

        {/* PLAYER BAR */}
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
                <p className="font-outfit text-sm font-bold tracking-wide text-foreground">You</p>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-primary/50 text-primary font-mono font-semibold">
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
          <div className="scale-90 origin-right">
            <GameClock
              timeLeft={clocks[orientation]}
              isActive={activeColor === orientation && !isGameOver && moveHistory.length > 0}
              onTick={() => tickClock(orientation)}
              onExpire={() => endGame("resigned")}
            />
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="flex flex-col gap-4 w-full max-w-sm xl:w-80 h-full">
        <div className="w-full">
          <GameAlerts status={status} activeColor={activeColor} />
        </div>
        <div className="h-[250px] xl:h-[450px] w-full flex">
          <MoveHistory moves={moveHistory} />
        </div>
        <div className="flex gap-3 w-full bg-card p-3 rounded-lg border border-border shadow-sm">
          {!isGameOver ? (
            <>
              <Button
                variant="outline"
                className="flex-1 font-outfit font-semibold tracking-wide"
                onClick={handleOfferDraw}
                disabled={localDrawModal || drawOfferedBy !== null}
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
          isRecipient={isRecipient}
          onAccept={handleAcceptDraw}
          onDecline={handleDeclineDraw}
        />
      )}
    </div>
  );
}