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
    const pathname = usePathname();

    return (
        <aside className="fixed md:flex w-64 flex-col border-r bg-background h-full overflow-y-auto">
            <div className="flex h-14 items-center border-b px-6 md:hidden">
                <h2 className="text-lg font-semibold tracking-tight">Menu</h2>
            </div>

            <nav className="flex flex-col gap-1 p-3">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;

                    return (
                        <Button
                            key={item.label}
                            asChild
                            variant={active ? "secondary" : "ghost"}
                            className="justify-start gap-2"
                        >
                            <Link href={item.href}>
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        </Button>
                    );
                })}
            </nav>
        </aside>
    );
}
