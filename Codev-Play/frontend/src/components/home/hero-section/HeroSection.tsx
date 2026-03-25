"use client";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import HeroTitle from "./HeroTitle";
import HeroImages from "./HeroImages";

export default function HeroSection() {
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
      const VanillaTilt = require("../../../lib/vanilla-tilt");
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
          <HeroTitle />
          <HeroImages />
        </div>
      </section>
    </div>
  );
}
