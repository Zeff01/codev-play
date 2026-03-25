"use client";

import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "./ui/ModeToggle";
import { Sidebar } from "./sidebar";
import { useAuth } from "@/context/AuthContext";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import { Menu, Bell, User, LogOut } from "lucide-react";

import LogoutButton from "./ui/logoutbutton";

export function Header() {
    const { user } = useAuth();

    const initials =
        user?.username
            ?.split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase() || "U";

    const notifications = [
        { id: 1, text: "You won a match 🎉" },
        { id: 2, text: "New game added: Tetris" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="flex h-14 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-3">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="left" className="p-0 w-64">
                            <SheetTitle className="sr-only">
                                Navigation Menu
                            </SheetTitle>

                            <SheetDescription className="sr-only">
                                Main navigation links
                            </SheetDescription>

                            <Sidebar />
                        </SheetContent>
                    </Sheet>

                    <Link href="/dashboard">
                        <Image
                            src="/codevplay-black.svg"
                            alt="CodevPlay"
                            width={140}
                            height={40}
                            priority
                            className="block dark:hidden"
                        />

                        <Image
                            src="/codevplay-white.svg"
                            alt="CodevPlay"
                            width={140}
                            height={40}
                            priority
                            className="hidden dark:block"
                        />
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative"
                            >
                                <Bell className="h-5 w-5" />
                                {notifications.length > 0 && (
                                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                                )}
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-72">
                            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {notifications.length === 0 ? (
                                <div className="p-3 text-sm text-muted-foreground">
                                    No notifications
                                </div>
                            ) : (
                                notifications.map((n) => (
                                    <DropdownMenuItem key={n.id}>
                                        {n.text}
                                    </DropdownMenuItem>
                                ))
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="hidden md:block">
                        <ModeToggle />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={user?.avatarUrl || ""} />
                                    <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="flex justify-between gap-2">
                                <div className="flex flex-col">
                                    <span>{user?.username || "Guest"}</span>
                                    {user?.email && (
                                        <span className="text-xs text-muted-foreground">
                                            {user.email}
                                        </span>
                                    )}
                                </div>

                                <div className="md:hidden">
                                    <ModeToggle />
                                </div>
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem asChild>
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <User className="h-4 w-4" />
                                    Profile
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem asChild>
                                <LogoutButton className="w-full justify-start gap-2 cursor-pointer">
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </LogoutButton>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
