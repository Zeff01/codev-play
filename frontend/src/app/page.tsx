"use client";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import GameSection from "@/components/home/GameSection";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
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
