"use client";

import { Button } from "./button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface LogoutButtonProps {
    children?: React.ReactNode;
    className?: string;
}

export default function LogoutButton({
    children,
    className,
}: LogoutButtonProps) {
    const router = useRouter();
    const { logout } = useAuth();

    async function handleLogout() {
        try {
            await fetch("http://localhost:5000/logout", {
                method: "POST",
                credentials: "include",
            });
            logout();
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    return (
        <Button
            variant="destructive"
            onClick={handleLogout}
            className={className}
        >
            {children || "Logout"}
        </Button>
    );
}
