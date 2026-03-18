"use client";

import { RegisterForm } from "@/components/auth/RegisterForm";
import { useRegisterToggle } from "@/hooks/auth/useRegisterToggle";

export default function RegisterPage() {
    const { toggleRegister } = useRegisterToggle();
    return <RegisterForm onToggleLogin={toggleRegister} />;
}
