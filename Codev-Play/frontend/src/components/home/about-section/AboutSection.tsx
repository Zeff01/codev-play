"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import AboutCTA from "./AboutCTA";
import AboutFeatures from "./AboutFeatures";
import AboutHeader from "./AboutHeader";
import AboutVisual from "./AboutVisual";
import AboutText from "./AboutText";

export default function AboutSection() {
  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#about",
        start: "top 60%",
      },
    });

    tl.fromTo(
      ".about-title",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power4.Out",
        stagger: 0.2,
      },
    );

    tl.fromTo(
      ".content",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power4.Out",
        stagger: 0.2,
      },
      "-=0.5",
    );

    tl.fromTo(
      ".feature-card",
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

    tl.fromTo(
      ".CTA",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.Out", stagger: 0.2 },
      "-=0.5",
    );
  }, []);

  return (
    <section
      id="about"
      className="relative min-h-screen flex flex-col justify-center items-center text-white pt-40 pb-20 overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 [background:radial-gradient(125%_125%_at_50%_50%,rgba(99,102,241,0.1)_0%,rgba(168,85,247,0.05)_40%,transparent_100%)]"></div>
      <div className="max-w-6xl w-full mx-auto px-8">
        <AboutHeader />
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <AboutText />
          <AboutVisual />
        </div>
        <AboutFeatures />
        <AboutCTA />
      </div>
    </section>
  );
}
