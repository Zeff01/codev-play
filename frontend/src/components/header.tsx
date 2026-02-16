"use client";

import Link from "next/link";
import { ModeToggle } from "./ui/ModeToggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "./ui/logoutbutton";
import { User, LogOut } from "lucide-react";

export function Header() {
    const { user } = useAuth();

    const initials =
        user?.username
            ?.split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase() || "U";

    return (
        <header className="h-14 border-b px-4 flex items-center justify-between">
            <h1 className="font-medium text-lg">LOGO</h1>

            <div className="flex items-center gap-3">
                <ModeToggle />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="cursor-pointer h-9 w-9">
                            <AvatarImage src={user?.avatarUrl || ""} />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-48 px-2">
                        <DropdownMenuLabel>
                            {user?.username || "Guest"}
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

                        <DropdownMenuItem asChild>
                            <LogoutButton className="w-full justify-start gap-2 mt-2 cursor-pointer">
                                <LogOut className="h-4 w-4 text-white" />
                                Logout
                            </LogoutButton>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
