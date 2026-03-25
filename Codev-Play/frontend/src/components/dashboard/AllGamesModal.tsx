"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ALL_GAMES } from "@/lib/dashboard-config/games-config";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function AllGamesModal({ trigger }: { trigger: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      {/* FIX: Increased width from 'max-w-4xl' to 'max-w-6xl' (approx 1152px).
        This provides enough horizontal space for 3 columns without overlapping text.
      */}
      <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-hidden flex flex-col border-orange-500/20 bg-card/98 backdrop-blur-3xl p-0">
        <DialogHeader className="p-12 pb-8 border-b border-muted/30">
          <DialogTitle className="text-5xl font-black italic tracking-tighter uppercase leading-none">
            Game{" "}
            <span className="text-orange-500 underline decoration-4 underline-offset-8">
              Vault
            </span>
          </DialogTitle>
          <DialogDescription className="text-base font-medium mt-6 text-muted-foreground/70">
            Explore our full library of 11 interactive challenges.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-12 pt-8 scrollbar-thin scrollbar-thumb-orange-500/10">
          {/* Using 'lg:grid-cols-3' with the wider container ensures each 
             cell has enough 'breathing room' for the labels.
          */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
            {ALL_GAMES.map((game) => (
              <Link key={game.path} href={game.path}>
                <div className="group relative flex items-center gap-8 p-6 rounded-3xl border border-muted/50 bg-muted/10 hover:border-orange-500/40 hover:bg-orange-500/[0.04] transition-all duration-300 ease-out shadow-sm hover:shadow-xl hover:shadow-orange-500/5">
                  {/* Icon container with fixed size to prevent shrinking */}
                  <div className="p-5 rounded-2xl bg-background border border-muted/50 group-hover:border-orange-500/30 transition-all shrink-0 shadow-inner">
                    <game.icon
                      className={`w-8 h-8 ${game.color} transition-transform group-hover:scale-110 group-hover:rotate-3`}
                    />
                  </div>

                  {/* Text block with proper flex alignment */}
                  <div className="flex flex-col gap-1.5 overflow-hidden">
                    <h3 className="font-extrabold text-xl tracking-tight truncate group-hover:text-orange-500 transition-colors">
                      {game.name}
                    </h3>
                    <span className="text-[11px] uppercase font-black text-muted-foreground/40 tracking-[0.25em]">
                      {game.category}
                    </span>
                  </div>

                  <ChevronRight className="w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-orange-500 ml-auto shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="p-6 bg-muted/5 border-t border-muted/20 text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground/30 font-black italic">
            Codev Play Engine v1.0
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
