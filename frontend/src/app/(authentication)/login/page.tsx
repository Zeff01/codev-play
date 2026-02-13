"use client";

import React, { JSX, useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Register from "../register/page";
import { gsap } from "gsap";
import { useApiFetch } from "@/hooks/useApiFetch";

export default function LoginPage(): JSX.Element {
    const logoPath = "/codevplay-white.svg";

    const [emailorUsername, setEmailorUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { request } = useApiFetch();

    const InputBox =
        "border-b border-gray-300 py-1 focus:border-b-2 focus:border-purple-700 transition-colors focus:outline-none peer bg-inherit w-full text-white";
    const ErrorInputBox = "border-red-400 focus:border-red-500";

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailorUsername || !password) {
            setError("Please fill in all fields");
            return;
        }
        if (emailorUsername.length < 8) {
            setError("Email or username must be at least 8 characters");
            return;
        }

        try {
            const payloadUsername = emailorUsername.trim();
            const res = await request("/api/auth/login", {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    username: payloadUsername,
                    password,
                }),
            });
            login(res.data.user);
            router.push("/dashboard");
        } catch (err: any) {
            console.log("API Error:", err);
        }
    };

    const tl = useRef<gsap.core.Timeline | null>(null);
    const [showRegister, setShowRegister] = useState(() => {
        const view = searchParams.get("view");
        return view === "register";
    });
    const toggleLogin = () => {
        const isMdScreen = window.innerWidth >= 768;
        if (isMdScreen) {
            setShowRegister((prev) => !prev);
        } else {
            router.push("/register");
        }
    };

    useEffect(() => {
        tl.current = gsap.timeline({ paused: true });
        tl.current.fromTo(
            ".backdrop",
            {
                right: "0",
            },
            {
                right: "50%",
                duration: 0.5,
                ease: "power1.inOut",
            },
        );
    }, []);

    useEffect(() => {
        if (tl.current) {
            if (showRegister) {
                tl.current.play();
            } else {
                tl.current.reverse();
            }
        }
    }, [showRegister]);

    return (
        <div className="relative overflow-hidden">
            <img
                src="/CODEVPLAY-IMAGE1.png"
                alt="Login Image"
                className="backdrop absolute right-0 w-1/2 h-full object-cover z-30 hidden md:block"
            />
            <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 text-white">
                <div className="flex flex-col md:flex items-center justify-center p-8 relative bg-slate-950 overflow-hidden">
                    <div className="absolute bottom-0 left-[-30%] right-0 top-[50%] h-125 w-125 rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
                    <div className="absolute bottom-0 right-[-30%] top-[-10%] h-125 w-125 rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
                    <img
                        className="justify-center max-h-10 mt-4 mb-2 justify-self-start"
                        src={logoPath}
                        alt="CODEVPLAY Logo"
                    />
                    <div className="flex flex-col justify-start items-center gap-1 w-full mt-0 mb-0">
                        <h1 className="font-[Outfit] text-2xl ">
                            Log in to your account{" "}
                        </h1>
                        <h2 className="font-[Roboto] text-white/70 text-sm">
                            Welcome back! Please enter your details.
                        </h2>
                    </div>
                    <div className="flex flex-col gap-8 w-full justify-center max-w-sm">
                        <form
                            onSubmit={handleLogin}
                            className="flex flex-col w-full max-w-md mt-8 z-20"
                        >
                            <div className="relative mb-8">
                                <input
                                    id="emailorUsername"
                                    type="email"
                                    placeholder=""
                                    value={emailorUsername}
                                    onChange={(e) => {
                                        setEmailorUsername(e.target.value);
                                        setError("");
                                    }}
                                    required
                                    className={`${InputBox} ${error ? ErrorInputBox : ""}`}
                                />
                                <label
                                    htmlFor="emailorUsername"
                                    className="absolute -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-purple-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm text-white"
                                >
                                    Username or Email
                                </label>
                            </div>
                            <div className="relative mb-2">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder=""
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError("");
                                    }}
                                    required
                                    className={`${InputBox} ${error ? ErrorInputBox : ""}`}
                                />
                                <label
                                    htmlFor="password"
                                    className="absolute -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-purple-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm text-white"
                                >
                                    Password
                                </label>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-700 focus:outline-none duration-200 cursor-pointer"
                                >
                                    {showPassword ? (
                                        <Eye size={20} />
                                    ) : (
                                        <EyeOff size={20} />
                                    )}
                                </button>
                            </div>
                            <div className="flex justify-end">
                                <a
                                    href="/forgot-password"
                                    className="text-sm text-shadow-white hover:text-indigo-400 mt-2"
                                >
                                    Forgot Password?
                                </a>
                            </div>

                            {error && (
                                <p className="text-red-400 text-sm mt-3 text-center">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] text-white font-semibold py-2 px-4 rounded-md mt-6 cursor-pointer"
                            >
                                Sign In
                            </button>
                            <label
                                htmlFor="Register"
                                className="mt-4 text-sm self-center"
                            >
                                New User?{" "}
                                <button
                                    type="button"
                                    onClick={toggleLogin}
                                    className="text-indigo-400 hover:underline cursor-pointer"
                                >
                                    Register here
                                </button>
                            </label>
                        </form>
                        <div className="flex justify-center z-20">
                            <a
                                href="/"
                                className="text-indigo-400 hover:text-indigo-700 duration-200 cursor-pointer"
                            >
                                Go Back
                            </a>
                        </div>
                    </div>
                </div>
                <div className="hidden md:block">
                    <Register onToggleLogin={toggleLogin} />
                </div>
            </div>
        </div>
    );
}
