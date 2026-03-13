"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useApiFetch } from "@/hooks/useApiFetch";
import type { LoginFormData, LoginFormErrors } from "@/types/auth";

function validateLoginForm(data: LoginFormData): LoginFormErrors {
    const errors: LoginFormErrors = {};

    if (!data.email || !data.password) {
        errors.general = "Please fill in all fields";
    } else if (data.email.length < 8) {
        errors.email = "Email must be at least 8 characters";
    }

    return errors;
}

export function useLoginForm() {
    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<LoginFormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const router = useRouter();
    const { request } = useApiFetch();

    function updateField(field: keyof LoginFormData, value: string) {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({
            ...prev,
            [field]: undefined,
            general: undefined,
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const validationErrors = validateLoginForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        try {
            const res = await request("/api/auth/login", {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    email: formData.email.trim(),
                    password: formData.password,
                }),
            });

            login(res.data.user);
            router.push("/dashboard");
        } catch (err: unknown) {
            console.error("Login error:", err);
            setErrors({ general: "Invalid credentials. Please try again." });
        } finally {
            setIsLoading(false);
        }
    }

    return { formData, errors, isLoading, updateField, handleSubmit };
}
