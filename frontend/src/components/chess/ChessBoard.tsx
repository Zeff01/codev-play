"use client";

import { useState, useCallback, useEffect } from "react";
import { Chess } from "chess.js";
import type { ValidationResult, GameStatus } from "@/types/chess.type";
import { cn } from "@/lib/utils";

import TurnIndicator from "./board/TurnIndicator";
import { FileLabelRow, RankLabelCol } from "./board/BoardLabels";
import BoardSquare from "./board/BoardSquare";
import PromotionPicker from "./board/PromotionPicker";

type Square = string;
type Color = "w" | "b";

interface Props {
  position: string;
  activeColor: Color;
  status: GameStatus;
  onMove: (from: Square, to: Square, promotion?: string) => void;
  validationResult: ValidationResult | null;
  orientation?: Color;
  disabled?: boolean;
}

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1] as const;

function parseFen(fen: string): Record<Square, string> {
  const pieces: Record<Square, string> = {};
  const rows = fen.split(" ")[0].split("/");
  rows.forEach((row, rankIdx) => {
    let fileIdx = 0;
    for (const char of row) {
      if (/\d/.test(char)) {
        fileIdx += parseInt(char, 10);
      } else {
        pieces[`${FILES[fileIdx]}${8 - rankIdx}`] = char;
        fileIdx++;
      }
    }
  });
  return pieces;
}

export default function ChessBoard({
  position,
  activeColor,
  status,
  onMove,
  validationResult,
  orientation = "w",
  disabled = false,
}: Props) {
  const [selected, setSelected] = useState<Square | null>(null);
  const [legalSquares, setLegalSquares] = useState<Set<Square>>(new Set());
  const [promotionPending, setPromotionPending] = useState<{
    from: Square;
    to: Square;
  } | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);

  const pieceMap = parseFen(position);
  const files = orientation === "w" ? FILES : [...FILES].reverse();
  const ranks = orientation === "w" ? RANKS : [...RANKS].reverse();

  useEffect(() => {
    if (validationResult && !validationResult.valid) {
      setIsFlashing(true);
      const t = setTimeout(() => setIsFlashing(false), 400);
      return () => clearTimeout(t);
    }
  }, [validationResult]);

  useEffect(() => {
    setSelected(null);
    setLegalSquares(new Set());
  }, [activeColor]);

  const getLegalSquares = useCallback(
    (square: Square, fen: string): Set<Square> => {
      try {
        const engine = new Chess(fen);
        const moves = engine.moves({ square: square as any, verbose: true });
        return new Set(moves.map((m: any) => m.to));
      } catch {
        return new Set();
      }
    },
    [],
  );

  // --- DRAG AND DROP HANDLERS ---

  const handleDragStart = useCallback(
    (e: React.DragEvent, square: Square) => {
      if (disabled || promotionPending) {
        e.preventDefault();
        return;
      }

      // Save the starting square in the drag event
      e.dataTransfer.setData("text/plain", square);
      e.dataTransfer.effectAllowed = "move";

      // Instantly select the piece and show legal moves while dragging!
      if (pieceMap[square]) {
        setSelected(square);
        setLegalSquares(getLegalSquares(square, position));
      }
    },
    [disabled, promotionPending, pieceMap, position, getLegalSquares],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    // We MUST prevent default here to tell the browser "yes, you can drop here"
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetSquare: Square) => {
      e.preventDefault();
      const sourceSquare = e.dataTransfer.getData("text/plain") as Square;

      // If they dropped it somewhere weird or on the exact same square, cancel
      if (!sourceSquare || sourceSquare === targetSquare) {
        setSelected(null);
        setLegalSquares(new Set());
        return;
      }

      // If they dropped it on a legal square, execute the move!
      if (legalSquares.has(targetSquare)) {
        const piece = pieceMap[sourceSquare];
        const isPromotion =
          (piece === "P" && targetSquare[1] === "8") ||
          (piece === "p" && targetSquare[1] === "1");

        if (isPromotion) {
          setPromotionPending({ from: sourceSquare, to: targetSquare });
          setSelected(null);
          setLegalSquares(new Set());
          return;
        }

        onMove(sourceSquare, targetSquare);
      }

      // Reset the board selection after the drop
      setSelected(null);
      setLegalSquares(new Set());
    },
    [legalSquares, pieceMap, onMove],
  );

  // --- CLICK HANDLER (Kept as a fallback for accessibility!) ---
  const handleSquareClick = useCallback(
    (square: Square) => {
      if (disabled || promotionPending) return;

      if (selected && legalSquares.has(square)) {
        const piece = pieceMap[selected];
        const isPromotion =
          (piece === "P" && square[1] === "8") ||
          (piece === "p" && square[1] === "1");

        if (isPromotion) {
          setPromotionPending({ from: selected, to: square });
          setSelected(null);
          setLegalSquares(new Set());
          return;
        }

        onMove(selected, square);
        setSelected(null);
        setLegalSquares(new Set());
        return;
      }

      if (selected === square) {
        setSelected(null);
        setLegalSquares(new Set());
        return;
      }

      if (pieceMap[square]) {
        setSelected(square);
        setLegalSquares(getLegalSquares(square, position));
        return;
      }

      setSelected(null);
      setLegalSquares(new Set());
    },
    [
      disabled,
      selected,
      legalSquares,
      pieceMap,
      promotionPending,
      position,
      onMove,
      getLegalSquares,
    ],
  );

  const handlePromotion = useCallback(
    (piece: string) => {
      if (!promotionPending) return;
      onMove(promotionPending.from, promotionPending.to, piece);
      setPromotionPending(null);
    },
    [promotionPending, onMove],
  );

  return (
    <div className="relative select-none flex flex-col items-center gap-2">
      <TurnIndicator activeColor={activeColor} status={status} />
      <FileLabelRow files={files} />

      <div className="flex items-stretch">
        <RankLabelCol ranks={ranks} side="left" />

        <div
          role="grid"
          aria-label="Chess board"
          className={cn(
            "grid grid-cols-8 shadow-xl transition-all duration-150 rounded-sm overflow-hidden",
            isFlashing
              ? "ring-2 ring-destructive ring-offset-2 ring-offset-background"
              : "ring-1 ring-border",
          )}
        >
          {ranks.map((rank) =>
            files.map((file) => {
              const square = `${file}${rank}`;
              const piece = pieceMap[square];
              const isLight = (FILES.indexOf(file) + rank) % 2 === 0;

              return (
                <BoardSquare
                  key={square}
                  square={square}
                  piece={piece}
                  isLight={isLight}
                  isSelected={selected === square}
                  isLegal={legalSquares.has(square)}
                  isCapture={legalSquares.has(square) && !!piece}
                  disabled={disabled}
                  onClick={() => handleSquareClick(square)}
                  // Wire up our new Drag functions!
                  onDragStart={(e) => handleDragStart(e, square)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, square)}
                />
              );
            }),
          )}
        </div>

        <RankLabelCol ranks={ranks} side="right" />
      </div>

      <FileLabelRow files={files} />

      {promotionPending && (
        <PromotionPicker color={activeColor} onSelect={handlePromotion} />
      )}
    </div>
  );
}
