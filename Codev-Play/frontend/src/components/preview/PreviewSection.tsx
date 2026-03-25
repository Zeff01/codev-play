"use client";
import { useLayoutEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { gsap } from "gsap";
import { gameInfo } from "../../data/gameInfo";
import PreviewImage from "./PreviewImage";
import PreviewDetails from "./PreviewDetails";

export default function GamePreview() {
  const params = useParams();
  const game = params.slug as string;

  const tl = useRef<gsap.core.Timeline | null>(null);
  useLayoutEffect(() => {
    tl.current = gsap.timeline();
    tl.current
      .to(".backdrop-gradient", {
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.5,
        ease: "power1.inOut",
      })
      .fromTo(
        ".preview-image",
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
        "-=1.75",
      )
      .fromTo(
        ".preview-detail",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power4.out",
          delay: 0.5,
          stagger: 0.2,
        },
        "-=1.75",
      );
  }, []);

  const currentGame = gameInfo[game];

  return (
    <section className="relative pt-28 pb-13 font-['Outfit']">
      <div className="backdrop-gradient opacity-0 blur-[20px] absolute inset-0 -z-10 [background:radial-gradient(125%_125%_at_50%_20%,#000_40%,#63e_100%)]"></div>
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-7 text-white">
          <PreviewImage name={currentGame.name} image={currentGame.image} />
          <PreviewDetails
            name={currentGame.name}
            description={currentGame.description}
            genre={currentGame.genre}
            howToPlay={currentGame.howToPlay}
          />
        </div>
      </div>
    </section>
  );
}
