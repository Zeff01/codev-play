"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import GameGridCard from "./GameGridCard";
import { gameImages } from "@/data/gameImage";

export default function GameSection() {
  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#game",
        start: "top 60%",
      },
    });

    tl.fromTo(
      ".game-card",
      { scale: 0.8, opacity: 0, filter: "blur(10px)" },
      {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1,
        ease: "power4.inOut",
        delay: 0.3,
        stagger: 0.2,
      },
      "-=0.75",
    );
  }, []);

  return (
    <section
      id="game"
      className="relative pt-28 pb-20 text-center font-['Outfit']"
    >
      <div className="absolute inset-0 -z-10 [background:radial-gradient(125%_125%_at_50%_50%,rgba(107,114,128,0.1)_0%,rgba(75,85,99,0.05)_40%,transparent_100%)]"></div>
      <div className="mx-auto max-w-6xl px-8">
        <h3 className="mb-10 text-4xl font-bold tracking-tight">
          Available Game
        </h3>
        <div className="grid grid-cols-2 gap-4 md:gap-8 sm:grid-cols-3 lg:grid-cols-3">
          {gameImages.map((game) => (
            <Link key={game.id} href={`/preview/${game.name.toLowerCase()}`}>
              <GameGridCard name={game.name} image={game.src} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
