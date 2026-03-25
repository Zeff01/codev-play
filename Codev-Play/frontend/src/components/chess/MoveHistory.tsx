"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MoveEntry } from "@/store/chess/useChessStore";

// Types

interface Props {
    moves: MoveEntry[];
}

interface MovePair {
    moveNumber: number;
    white: string | null;
    black: string | null;
}

// Helpers

function pairMoves(moves: MoveEntry[]): MovePair[] {
    const pairs: MovePair[] = [];
    for (let i = 0; i < moves.length; i += 2) {
        pairs.push({
            moveNumber: moves[i].moveNumber,
            white: moves[i]?.san ?? null,
            black: moves[i + 1]?.san ?? null,
        });
    }
    return pairs;
}

// Component

export default function MoveHistory({ moves }: Props) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [moves]);

    const pairs = pairMoves(moves);

    return (
        <Card className="flex flex-col flex-1 min-h-0">
            <CardHeader className="py-2 px-3 border-b border-border">
                <div className="flex items-center justify-between">
                    <CardTitle className="font-outfit text-xs uppercase tracking-widest text-muted-foreground">
                        Moves
                    </CardTitle>
                    <span className="font-mono text-xs text-muted-foreground/60">
                        {moves.length > 0 ? `${moves.length} ply` : "—"}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 min-h-0">
                <ScrollArea className="h-48">
                    {pairs.length === 0 ? (
                        <p className="font-roboto text-xs text-muted-foreground text-center py-6">
                            No moves yet.
                        </p>
                    ) : (
                        <table className="w-full" role="log" aria-live="polite">
                            <thead>
                                <tr className="border-b border-border/50">
                                    <th className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-wider text-right px-2 py-1.5 w-8">
                                        #
                                    </th>
                                    <th className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-wider text-left px-2 py-1.5">
                                        White
                                    </th>
                                    <th className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-wider text-left px-2 py-1.5">
                                        Black
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {pairs.map((pair, idx) => (
                                    <tr
                                        key={pair.moveNumber}
                                        className={
                                            idx === pairs.length - 1
                                                ? "bg-muted/40"
                                                : "hover:bg-muted/20 transition-colors"
                                        }
                                    >
                                        <td className="font-mono text-[11px] text-muted-foreground text-right px-2 py-1">
                                            {pair.moveNumber}.
                                        </td>
                                        <td className="font-mono text-[12px] text-foreground px-2 py-1">
                                            {pair.white ?? ""}
                                        </td>
                                        <td className="font-mono text-[12px] text-foreground px-2 py-1">
                                            {pair.black ?? ""}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <div ref={bottomRef} />
                </ScrollArea>
            </CardContent>
        </Card>
    );
}