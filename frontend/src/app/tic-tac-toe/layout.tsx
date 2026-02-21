import React from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import Footer from "@/components/layout/Footer";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
