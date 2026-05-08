// lib/chess-utils.ts
import { Chess } from "chess.js";
import type { GameStatus } from "@/types/chess.type";

export type PieceSymbol = "p" | "n" | "b" | "r" | "q";

const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
};

const STARTING_COUNTS: Record<PieceSymbol, number> = {
  p: 8,
  n: 2,
  b: 2,
  r: 2,
  q: 1,
};

  export function getMaterialAdvantage(fen: string) {
    const board = fen.split(" ")[0];
    const counts = { w: { p: 0, n: 0, b: 0, r: 0, q: 0 }, b: { p: 0, n: 0, b: 0, r: 0, q: 0 } };
    const isPiece = (c: string) => "pnbrq".includes(c);
    for (const char of board) {
        if (!isPiece(char.toLowerCase())) continue;
        if (char === char.toLowerCase()) {
            counts.b[char as PieceSymbol]++;
        } else {
            counts.w[char.toLowerCase() as PieceSymbol]++;
        }
    }
    console.log("counts:", JSON.stringify(counts));

  const wCaptured: PieceSymbol[] = [];
  const bCaptured: PieceSymbol[] = [];
  let wScore = 0;
  let bScore = 0;

  (Object.keys(STARTING_COUNTS) as PieceSymbol[]).forEach((piece) => {
    const blackLost = STARTING_COUNTS[piece] - counts.b[piece];
    for (let i = 0; i < blackLost; i++) wCaptured.push(piece);

    const whiteLost = STARTING_COUNTS[piece] - counts.w[piece];
    for (let i = 0; i < whiteLost; i++) bCaptured.push(piece);

    wScore += counts.w[piece] * PIECE_VALUES[piece];
    bScore += counts.b[piece] * PIECE_VALUES[piece];
  });

  const sortOrder = { q: 1, r: 2, b: 3, n: 4, p: 5 };
  wCaptured.sort((a, b) => sortOrder[a] - sortOrder[b]);
  bCaptured.sort((a, b) => sortOrder[a] - sortOrder[b]);

  return {
    w: { captured: wCaptured, advantage: wScore - bScore },
    b: { captured: bCaptured, advantage: bScore - wScore },
  };
}

export const INITIAL_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function deriveStatus(engine: Chess): GameStatus {
  // IMPORTANT ORDER (prevents false checkmate)
  if (engine.isCheckmate()) return "checkmate";
  if (engine.isStalemate()) return "stalemate";
  if (engine.isThreefoldRepetition()) return "draw";
  if (engine.isInsufficientMaterial()) return "draw";
  if (engine.isDraw()) return "draw";
  if (engine.isCheck()) return "check";

  return "playing";
}