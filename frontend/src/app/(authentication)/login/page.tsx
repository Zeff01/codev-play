"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { useRegisterToggle } from "@/hooks/auth/useRegisterToggle";

export default function LoginPage() {
    const { toggleRegister } = useRegisterToggle();
    return <LoginForm onToggleRegister={toggleRegister} />;
}
