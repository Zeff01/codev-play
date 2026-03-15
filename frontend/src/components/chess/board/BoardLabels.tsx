"use client";

interface Props {
    files: readonly string[];
    ranks: readonly number[];
}

export function FileLabelRow({ files }: Pick<Props, "files">) {
    return (
        <div className="flex pl-5">
            {files.map((f) => (
                <span
                    key={f}
                    className="w-14 lg:w-16 xl:w-18 text-center font-mono text-[10px] text-muted-foreground uppercase tracking-widest"
                    aria-hidden="true"
                >
                    {f}
                </span>
            ))}
        </div>
    );
}

export function RankLabelCol({ ranks, side }: { ranks: readonly number[]; side: "left" | "right" }) {
    return (
        <div className={`flex flex-col justify-around w-5 ${side === "left" ? "mr-0.5" : "ml-0.5"}`}>
            {ranks.map((r) => (
                <span
                    key={r}
                    className="h-14 lg:h-16 xl:h-18 flex items-center justify-center font-mono text-[10px] text-muted-foreground"
                    aria-hidden="true"
                >
                    {r}
                </span>
            ))}
        </div>
    );
}