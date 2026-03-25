// Pick a promotion piece

"use client";

import { PIECE_GLYPHS } from "./BoardSquare";

interface Props {
    onSelect: (piece: string) => void;
}

export default function PromotionPicker({ onSelect }: Props) {
    return (
        <div
            role="dialog"
            aria-label="Choose promotion piece"
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/90 backdrop-blur-sm z-10 rounded-sm"
        >
            <p className="font-roboto text-xs text-muted-foreground uppercase tracking-widest">
                Promote to
            </p>
            <div className="flex gap-2">
                {["q", "r", "b", "n"].map((p) => (
                    <button
                        key={p}
                        onClick={() => onSelect(p)}
                        aria-label={`Promote to ${p}`}
                        className="w-14 h-14 flex items-center justify-center rounded-md border border-border bg-card text-[2rem] hover:bg-accent hover:border-primary/50 transition-colors cursor-pointer"
                    >
                        {PIECE_GLYPHS[p]}
                    </button>
                ))}
            </div>
        </div>
    );
}