"use client";

import { useState } from "react";
import { useApiFetch } from "@/hooks/useApiFetch";
import type { RegisterFormData, RegisterFormErrors } from "@/types/auth";

function validateRegisterForm(data: RegisterFormData): RegisterFormErrors {
    const errors: RegisterFormErrors = {};

    if (
        !data.email ||
        !data.username ||
        !data.password ||
        !data.confirmPassword
    ) {
        errors.general = "Please fill in all fields";
        return errors;
    }

    if (data.username.length < 3 || data.username.length > 30) {
        errors.username = "Username must be between 3 and 30 characters";
    }

    if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
        errors.username =
            "Username can only contain letters, numbers, and underscores";
    }

    if (data.password.length < 6) {
        errors.password = "Password must be at least 6 characters long";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
        errors.password =
            "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }

    return errors;
}

export function useRegisterForm(onSuccess?: () => void) {
    const [formData, setFormData] = useState<RegisterFormData>({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<RegisterFormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const { request } = useApiFetch();

    function updateField(field: keyof RegisterFormData, value: string) {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({
            ...prev,
            [field]: undefined,
            general: undefined,
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const validationErrors = validateRegisterForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);
        try {
            await request("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    email: formData.email,
                    username: formData.username,
                    password: formData.password,
                }),
            });

            setFormData({
                email: "",
                username: "",
                password: "",
                confirmPassword: "",
            });
            setErrors({});
            onSuccess?.();
        } catch (err: unknown) {
            if (err && typeof err === "object" && "errors" in err) {
                // Backend returned express-validator field errors
                const apiErrors = (
                    err as { errors: { path: string; msg: string }[] }
                ).errors;
                const fieldErrors: RegisterFormErrors = {};
                for (const e of apiErrors) {
                    fieldErrors[e.path as keyof RegisterFormErrors] = e.msg;
                }
                setErrors(fieldErrors);
            } else {
                const message =
                    err instanceof Error ? err.message : "Something went wrong";
                setErrors({ general: message });
            }
        } finally {
            setIsLoading(false);
        }
    }

    return { formData, errors, isLoading, updateField, handleSubmit };
}
