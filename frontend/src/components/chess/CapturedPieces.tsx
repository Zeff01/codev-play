"use client";

import Piece from "./board/Piece";

interface Props {
  capturedPieces: string[];
  advantage: number;
  capturedColor: "w" | "b";
}

export default function CapturedPieces({
  capturedPieces,
  advantage,
  capturedColor,
}: Props) {
  if (capturedPieces.length === 0 && advantage <= 0) return null;

  return (
    <div className="flex items-center gap-2 mt-1 min-h-[1.25rem]">
      {/* Removed the negative spacing and added flex-wrap so they flow nicely */}
      <div className="flex flex-wrap gap-0.5">
        {capturedPieces.map((p, i) => {
          const pieceType = capturedColor === "w" ? p.toUpperCase() : p;
          return (
            // Bumped size from w-3.5 to w-4 so they are easier to read
            <div key={i} className="w-4 h-4 pointer-events-none">
              <Piece type={pieceType} />
            </div>
          );
        })}
      </div>

      {advantage > 0 && (
        <span className="text-xs font-mono font-bold text-muted-foreground ml-1">
          +{advantage}
        </span>
      )}
    </div>
  );
}
