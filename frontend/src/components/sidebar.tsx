"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Gamepad2,
  Hand,
  Crown,
  Grid3x3,
  Bug,
  Columns,
  Blocks,
  Minus,
  Bomb,
  Brain,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },

  { label: "Pac-Man", href: "/pacman", icon: Gamepad2 },
  {
    label: "Rock Paper Scissors",
    href: "/rock-paper-scissors",
    icon: Hand,
  },
  { label: "Chess", href: "/chess", icon: Crown },
  { label: "Tic-Tac-Toe", href: "/tic-tac-toe", icon: Grid3x3 },
  { label: "Snake", href: "/snake", icon: Bug },
  { label: "Connect Four", href: "/connect-four", icon: Columns },
  { label: "Tetris", href: "/tetris", icon: Blocks },
  { label: "Pong", href: "/pong", icon: Minus },
  { label: "Minesweeper", href: "/minesweeper", icon: Bomb },
  { label: "Memory Match", href: "/memory", icon: Brain },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r p-4 gap-2">
      <h2 className="text-lg font-semibold mb-4">Sidebar</h2>

      <Button variant="ghost" asChild>
        <Link href="/dashboard">Dashboard</Link>
      </Button>

      <Button variant="ghost" asChild>
        <Link href="/tic-tac-toe">Tic Tac Toe</Link>
      </Button>

      <Button variant="ghost" asChild>
        <Link href="/rock-paper-scissors">Rock Paper Scissors</Link>
      </Button>

      <Button variant="ghost" asChild>
        <Link href="#">Game 2</Link>
      </Button>
    </aside>
  );
}
