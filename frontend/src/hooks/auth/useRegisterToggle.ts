"use client";

import { usePathname, useRouter } from "next/navigation";

export function useRegisterToggle() {
    const router = useRouter();
    const pathname = usePathname();

    const showRegister = pathname === "/register";

    function toggleRegister() {
        if (showRegister) {
            router.push("/login");
        } else {
            router.push("/register");
        }
    }

    return { showRegister, toggleRegister };
}
