"use client";

import Piece from "./Piece";

interface Props {
  color?: "w" | "b";
  onSelect: (piece: string) => void;
}

export default function PromotionPicker({ color = "w", onSelect }: Props) {
  return (
    <div
      role="dialog"
      aria-label="Choose promotion piece"
      // FIX: Bumped z-10 up to z-50 so it covers all pieces!
      className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/90 backdrop-blur-md z-50 rounded-sm"
    >
      <p className="font-roboto text-xs text-muted-foreground uppercase tracking-widest font-bold">
        Promote to
      </p>
      <div className="flex gap-2">
        {["q", "r", "b", "n"].map((p) => {
          const pieceType = color === "w" ? p.toUpperCase() : p;

          return (
            <button
              key={p}
              onClick={() => onSelect(p)}
              aria-label={`Promote to ${p}`}
              className="w-14 h-14 flex items-center justify-center rounded-md border border-border bg-card hover:bg-accent hover:border-primary/50 shadow-xl transition-all hover:scale-105 cursor-pointer"
            >
              <div className="w-10 h-10 pointer-events-none">
                <Piece type={pieceType} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
