"use client";
import Link from "next/link";
import Image from "next/image";
import CodevPlay from "../../../public/codevplay-white.svg";
import { useEffect, useState } from "react";

const Footer = () => {
    const [localTime, setLocalTime] = useState<string | null>(null);
    const [currentYear, setCurrentYear] = useState<string | null>(null);

    useEffect(() => {
        setLocalTime(new Date().toLocaleTimeString());
        setCurrentYear(new Date().getFullYear().toString());
        const timer = setInterval(
            () => setLocalTime(new Date().toLocaleTimeString()),
            1000,
        );
        return () => clearInterval(timer);
    }, []);

    return (
        <footer
            id="footer"
            className="relative overflow-hidden text-white bg-linear-to-r from-[#19163A] via-[#14112E] to-black border-t border-white/10"
        >
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.15),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(34,211,238,0.12),transparent_40%)]" />

            <div className="relative max-w-350 mx-auto px-6 md:px-10 py-16">
                <div className="grid md:grid-cols-3 gap-14 mb-20">
                    <div className="space-y-4 max-w-sm">
                        <Link href="/" className="block w-fit">
                            <Image
                                src={CodevPlay}
                                alt="CodevPlay Logo"
                                className="w-44 h-12 object-contain drop-shadow-[0_0_12px_rgba(168,85,247,0.35)]"
                            />
                        </Link>

                        <p className="text-sm text-gray-300 leading-relaxed">
                            Where developers hang out and play — a friendly
                            space to experiment, learn, and build together.
                        </p>
                    </div>

                    <nav aria-label="Explore" className="space-y-4">
                        <h3 className="font-semibold tracking-wide text-purple-300 text-sm uppercase">
                            Explore
                        </h3>

                        <ul className="space-y-2 text-sm">
                            {[
                                ["Home", "/"],
                                ["About", "/about"],
                                ["Playground", "/playground"],
                                ["Community", "/community"],
                            ].map(([label, href]) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block focus-visible:text-white"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <nav aria-label="Resources" className="space-y-4">
                        <h3 className="font-semibold tracking-wide text-cyan-300 text-sm uppercase">
                            Resources
                        </h3>

                        <ul className="space-y-2 text-sm">
                            {[
                                ["Docs", "/docs"],
                                ["GitHub", "https://github.com/"],
                                ["Contact", "/contact"],
                                ["Terms", "/terms"],
                            ].map(([label, href]) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        target={
                                            href.startsWith("http")
                                                ? "_blank"
                                                : undefined
                                        }
                                        className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block focus-visible:text-white"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div className="h-px w-full bg-linear-to-r from-transparent via-white/20 to-transparent mb-6" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
                    <div className="text-gray-400 text-center md:text-left">
                        © {currentYear}{" "}
                        <span className="text-white font-medium">
                            CodevPlay
                        </span>
                        . All rights reserved.
                    </div>

                    <div className="flex items-center gap-6 text-gray-400">
                        <div className="flex flex-col items-center md:items-end leading-tight">
                            <span className="text-[10px] uppercase tracking-widest text-gray-500">
                                Local Time
                            </span>
                            <span className="font-mono text-white">
                                {localTime}
                            </span>
                        </div>

                        <div className="w-px h-8 bg-white/10" />

                        <div className="flex flex-col items-center md:items-end leading-tight">
                            <span className="text-[10px] uppercase tracking-widest text-gray-500">
                                Version
                            </span>
                            <span className="text-white font-medium">v1.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
