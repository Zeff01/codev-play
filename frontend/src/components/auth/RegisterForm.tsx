"use client";

import Link from "next/link";
import Image from "next/image";
import { FloatingLabelInput } from "@/components/auth/FloatingLabelInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useRegisterForm } from "@/hooks/auth/useRegisterForm";

interface RegisterFormProps {
    onToggleLogin: () => void;
}

export function RegisterForm({ onToggleLogin }: RegisterFormProps) {
    const { formData, errors, isLoading, updateField, handleSubmit } =
        useRegisterForm(onToggleLogin);

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden text-white">
            {/* Background */}
            <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative z-10 w-full max-w-md md:mx-6 p-8 space-y-8">
                <Image
                    src="/codevplay-white.svg"
                    alt="CODEVPLAY Logo"
                    width={500}
                    height={500}
                    className="block mx-auto h-10 mb-2 drop-shadow-lg"
                    priority
                />

                <div className="text-center">
                    <h1 className="text-2xl font-[Outfit]">
                        Create new account
                    </h1>
                    <p className="text-sm text-white/70 mt-1 font-[Roboto]">
                        To start playing, fill it up!
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <FloatingLabelInput
                        id="email"
                        label="Email"
                        type="email"
                        value={formData.email}
                        hasError={!!errors.email || !!errors.general}
                        onChange={(e) => updateField("email", e.target.value)}
                        required
                    />

                    <FloatingLabelInput
                        id="username"
                        label="Username"
                        type="text"
                        value={formData.username}
                        hasError={!!errors.username}
                        onChange={(e) =>
                            updateField("username", e.target.value)
                        }
                        required
                    />
                    {errors.username && (
                        <p className="text-red-400 text-xs -mt-6 mb-2">
                            {errors.username}
                        </p>
                    )}

                    <PasswordInput
                        id="password"
                        label="Password"
                        value={formData.password}
                        hasError={!!errors.password}
                        onChange={(e) =>
                            updateField("password", e.target.value)
                        }
                    />
                    {errors.password && (
                        <p className="text-red-400 text-xs -mt-6 mb-2">
                            {errors.password}
                        </p>
                    )}

                    <PasswordInput
                        id="confirmPassword"
                        label="Confirm Password"
                        value={formData.confirmPassword}
                        hasError={!!errors.confirmPassword}
                        onChange={(e) =>
                            updateField("confirmPassword", e.target.value)
                        }
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-400 text-xs -mt-6 mb-2">
                            {errors.confirmPassword}
                        </p>
                    )}

                    {errors.general && (
                        <p className="text-red-400 text-sm text-center">
                            {errors.general}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-xl font-semibold bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Registering..." : "Register"}
                    </button>

                    <p className="mt-4 text-sm text-center text-white/70">
                        Already have an account?{" "}
                        <button
                            type="button"
                            onClick={onToggleLogin}
                            className="text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
                        >
                            Login here
                        </button>
                    </p>
                </form>

                <div className="flex justify-center">
                    <Link
                        href="/"
                        className="text-indigo-400 hover:text-indigo-700 duration-200"
                    >
                        Go Back
                    </Link>
                </div>
            </div>
        </div>
    );
}
