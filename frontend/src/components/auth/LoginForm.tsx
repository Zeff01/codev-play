"use client";

import Link from "next/link";
import Image from "next/image";
import { FloatingLabelInput } from "@/components/auth/FloatingLabelInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useLoginForm } from "@/hooks/auth/useLoginForm";

interface LoginFormProps {
    onToggleRegister: () => void;
}

export function LoginForm({ onToggleRegister }: LoginFormProps) {
    const { formData, errors, isLoading, updateField, handleSubmit } =
        useLoginForm();

    return (
        <div className="flex flex-col items-center justify-center p-8 relative bg-slate-950 overflow-hidden min-h-screen">
            {/* Decorative radial gradients */}
            <div className="absolute bottom-0 left-[-30%] right-0 top-[50%] h-125 w-125 rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]" />
            <div className="absolute bottom-0 right-[-30%] top-[-10%] h-125 w-125 rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]" />

            <Image
                src="/codevplay-white.svg"
                alt="CODEVPLAY Logo"
                width={500}
                height={500}
                className="max-h-10 mt-4 mb-2"
                priority
            />

            <div className="flex flex-col justify-start items-center gap-1 w-full mt-0 mb-0">
                <h1 className="font-[Outfit] text-2xl">
                    Log in to your account
                </h1>
                <h2 className="font-[Roboto] text-white/70 text-sm">
                    Welcome back! Please enter your details.
                </h2>
            </div>

            <div className="flex flex-col gap-8 w-full justify-center max-w-sm">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col w-full max-w-md mt-8 z-20"
                >
                    <FloatingLabelInput
                        id="email"
                        label="Email"
                        type="email"
                        value={formData.email}
                        hasError={!!errors.email || !!errors.general}
                        onChange={(e) => updateField("email", e.target.value)}
                        required
                    />

                    <PasswordInput
                        id="password"
                        label="Password"
                        value={formData.password}
                        hasError={!!errors.general}
                        onChange={(e) =>
                            updateField("password", e.target.value)
                        }
                    />

                    <div className="flex justify-end -mt-6">
                        <Link
                            href="/forgot-password"
                            className="text-sm text-shadow-white hover:text-indigo-400 mt-2"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    {errors.general && (
                        <p className="text-red-400 text-sm mt-3 text-center">
                            {errors.general}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] text-white font-semibold py-2 px-4 rounded-md mt-6 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>

                    <p className="mt-4 text-sm self-center">
                        New User?{" "}
                        <button
                            type="button"
                            onClick={onToggleRegister}
                            className="text-indigo-400 hover:underline cursor-pointer"
                        >
                            Register here
                        </button>
                    </p>
                </form>

                <div className="flex justify-center z-20">
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
