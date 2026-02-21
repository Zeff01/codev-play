"use client";
import { useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { gsap } from "gsap";
import Image from "next/image";
import Pacman from "../../../public/pacman.png";
import Chess from "../../../public/chess.png";
import Tictactoe from "../../../public/tictactoe.png";
import Tetris from "../../../public/tetris.png";
import Snake from "../../../public/snake.png";
import Minesweeper from "../../../public/minesweeper.png";

export default function HeroSection() {
  const router = useRouter();
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
      .to(
        ".hero-title",
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power4.Out",
          delay: 0.5,
          stagger: 0.2,
        },
        "-=1.0",
      )
      .fromTo(
        ".hero-image",
        { scale: 0.8 },
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
      );
    tl.current.eventCallback("onComplete", () => {
      const VanillaTilt = require("../../lib/vanilla-tilt");
      document
        .querySelectorAll("[data-tilt]")
        .forEach((el) => new VanillaTilt(el));
    });
  }, []);

  return (
    <div>
      <section
        id="home"
        className="relative min-h-screen flex flex-col justify-center items-center text-white pt-14"
      >
        <div className="backdrop-gradient opacity-0 blur-[20px] absolute inset-0 -z-10 [background:radial-gradient(125%_125%_at_50%_20%,#000_40%,#63e_100%)]"></div>
        <div className="max-w-450 w-full mx-auto px-8 pb-4 pt-18 lg:pt-4 xl:py-4 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left side - Title and CTA */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className='hero-title opacity-0 translate-y-12.5 text-4xl md:text-5xl lg:text-7xl font-bold font-["Outfit"] mb-6 leading-[0.9] max-w-2xl'>
              UNLOCK ENDLESS FUN FILLED WITH{" "}
              <span className="whitespace-nowrap bg-linear-to-r from-purple-500  to-cyan-400 inline-block text-transparent bg-clip-text hover:text-shadow-[0_0_25px_rgba(99,102,241,0.6)] cursor-default duration-300">
                CODEV PLAY
              </span>
            </h1>
            <p className='hero-title opacity-0 translate-y-12.5 text-lg md:text-xl text-gray-300 leading-6 mb-8 max-w-lg font-["Roboto"]'>
              Where Codev hangout and play — a friendly space to experiment,
              learn, and build together.
            </p>
            <div className="hero-title opacity-0 translate-y-12.5 flex gap-4">
              <Button
                onClick={() => router.push("/login?view=register")}
                className="px-8 py-3 text-lg cursor-pointer bg-linear-to-r hover:text-white hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)]"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                className="px-8 py-3 text-lg text-white border-white hover:bg-white/10 cursor-pointer"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right side - Image/Illustration */}
          <div className="flex-1 flex items-center h-[calc(100vh-150px)]">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-6 w-full lg:w-lg xl:w-full p-0 py-8 lg:py-8 lg:px-4">
              <div className="hidden xl:block"></div>
              <div className="hidden xl:block"></div>
              <Image
                data-tilt
                data-tilt-reverse
                data-tilt-scale="1.1"
                src={Pacman}
                alt="Pacman"
                className="hero-image opacity-0 blur-[10px] bg-white/10 backdrop-blur-md rounded-lg p-2.5 border border-white/20 hover:border-purple-800/50 hover:shadow-[0_0_20px_rgba(151,71,255,0.6)]"
              />
              <div className="hidden xl:block"></div>
              <Image
                data-tilt
                data-tilt-reverse
                data-tilt-scale="1.1"
                src={Chess}
                alt="Chess"
                className="hero-image opacity-0 blur-[10px] bg-white/10 backdrop-blur-md rounded-lg p-2.5 border border-white/20 hover:border-purple-800/50 hover:shadow-[0_0_20px_rgba(151,71,255,0.6)] hover:z-10"
              />
              <Image
                data-tilt
                data-tilt-reverse
                data-tilt-scale="1.1"
                src={Tictactoe}
                alt="Tic Tac Toe"
                className="hero-image opacity-0 blur-[10px] bg-white/10 backdrop-blur-md rounded-lg p-2.5 border border-white/20 hover:border-purple-800/50 hover:shadow-[0_0_20px_rgba(151,71,255,0.6)]"
              />
              <Image
                data-tilt
                data-tilt-reverse
                data-tilt-scale="1.1"
                src={Tetris}
                alt="Tetris"
                className="hero-image opacity-0 blur-[10px] bg-white/10 backdrop-blur-md rounded-lg p-2.5 border border-white/20 hover:border-purple-800/50 hover:shadow-[0_0_20px_rgba(151,71,255,0.6)]"
              />
              <Image
                data-tilt
                data-tilt-reverse
                data-tilt-scale="1.1"
                src={Snake}
                alt="Snake"
                className="hero-image opacity-0 blur-[10px] bg-white/10 backdrop-blur-md rounded-lg p-2.5 border border-white/20 hover:border-purple-800/50 hover:shadow-[0_0_20px_rgba(151,71,255,0.6)]"
              />
              <Image
                data-tilt
                data-tilt-reverse
                data-tilt-scale="1.1"
                src={Minesweeper}
                alt="Minesweeper"
                className="hero-image opacity-0 blur-[10px] bg-white/10 backdrop-blur-md rounded-lg p-2.5 border border-white/20 hover:border-purple-800/50 hover:shadow-[0_0_20px_rgba(151,71,255,0.6)]"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
