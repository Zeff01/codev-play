"use client";

import { Suspense } from "react";
import Image from "next/image";
import { useBackdropAnimation } from "@/hooks/auth/useBackdropAnimation";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useRegisterToggle } from "@/hooks/auth/useRegisterToggle";

function AuthLayoutContent({ children }: { children: React.ReactNode }) {
    const { showRegister, toggleRegister } = useRegisterToggle();
    useBackdropAnimation(showRegister);

    return (
        <div className="relative overflow-hidden">
            <Image
                src="/CODEVPLAY-IMAGE1.png"
                alt="Auth backdrop"
                width={1000}
                height={1000}
                className="backdrop absolute right-0 w-1/2 h-full object-cover z-30 hidden md:block"
                priority
            />

            <div className="md:hidden min-h-screen text-white">{children}</div>

            <div className="hidden md:grid md:grid-cols-2 min-h-screen text-white">
                <LoginForm onToggleRegister={toggleRegister} />
                <RegisterForm onToggleLogin={toggleRegister} />
            </div>
        </div>
    );
}

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense>
            <AuthLayoutContent>{children}</AuthLayoutContent>
        </Suspense>
    );
}
