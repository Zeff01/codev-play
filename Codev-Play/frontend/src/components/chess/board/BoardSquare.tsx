// Single square on the board which renders the piece glyph
// Highlight legal moves - to be improved
// capture and selection highlight



"use client";

import { cn } from "@/lib/utils";

// Glyphs are temporary placeholders
const T = "\uFE0E";
export const PIECE_GLYPHS: Record<string, string> = {
    K: `♔${T}`, Q: `♕${T}`, R: `♖${T}`, B: `♗${T}`, N: `♘${T}`, P: `♙${T}`,
    k: `♚${T}`, q: `♛${T}`, r: `♜${T}`, b: `♝${T}`, n: `♞${T}`, p: `♟${T}`,
};

interface Props {
    square: string;
    piece: string | undefined;
    isLight: boolean;
    isSelected: boolean;
    isLegal: boolean;
    isCapture: boolean;
    disabled: boolean;
    onClick: () => void;
}

export default function BoardSquare({
    square,
    piece,
    isLight,
    isSelected,
    isLegal,
    isCapture,
    disabled,
    onClick,
}: Props) {
    const isWhitePiece = piece === piece?.toUpperCase();

    return (
        <button
            role="gridcell"
            aria-label={`${square}${piece ? ` ${PIECE_GLYPHS[piece] ?? piece}` : ""}`}
            aria-selected={isSelected}
            disabled={disabled}
            onClick={onClick}
            className={cn(
                "w-14 h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 relative flex items-center justify-center transition-[filter,box-shadow] duration-75",
                isLight ? "bg-[#aaaaaa]" : "bg-[#1a1a1a]",
                isSelected && "brightness-150 shadow-[inset_0_0_0_3px_rgba(255,255,255,0.4)]",
                !disabled && !isSelected && "hover:brightness-125",
                disabled ? "cursor-default" : "cursor-pointer"
            )}
        >
            {isLegal && !isCapture && (
                <span className="absolute w-[33%] h-[33%] rounded-full bg-white/30 pointer-events-none z-10" aria-hidden="true" />
            )}
            {isCapture && (
                <span className="absolute inset-0 ring-inset ring-4 ring-white/40 pointer-events-none z-10" aria-hidden="true" />
            )}
            {piece && (
                <span
                    style={{
                        filter: isWhitePiece
                            ? "drop-shadow(1px 0 0 #000) drop-shadow(-1px 0 0 #000) drop-shadow(0 1px 0 #000) drop-shadow(0 -1px 0 #000)"
                            : "drop-shadow(1px 0 0 #fff) drop-shadow(-1px 0 0 #fff) drop-shadow(0 1px 0 #fff) drop-shadow(0 -1px 0 #fff)",
                    }}
                    className={cn(
                        "text-[2.35rem] lg:text-[2.6rem] xl:text-[2.8rem] leading-none pointer-events-none",
                        isWhitePiece ? "text-white" : "text-black"
                    )}
                    aria-hidden="true"
                >
                    {PIECE_GLYPHS[piece] ?? piece}
                </span>
            )}
        </button>
    );
}