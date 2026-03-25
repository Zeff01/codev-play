"use client";
import NavigationBar from "@/components/layout/Navbar";
import GamePreview from "@/components/preview/PreviewSection";
import Footer from "@/components/layout/Footer";

export default function PreviewPage() {
  return (
    <div>
      <NavigationBar />
      <GamePreview />
      <Footer />
    </div>
  );
}
