"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";

export default function DashboardPage() {
  return (
    <div className="flex -1 flex-col p-4">
      <Header />
      <Sidebar />
    </div>
  );
}
