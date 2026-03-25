"use client";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import GameSection from "@/components/home/game-section/GameSection";
import HeroSection from "@/components/home/hero-section/HeroSection";
import AboutSection from "@/components/home/about-section/AboutSection";
// @ts-ignore

export default function Home() {
  return (
    <main>
      <div>
        <Navbar />
        <HeroSection />
        <GameSection />
        <AboutSection />
        <Footer />
      </div>
    </main>
  );
}
