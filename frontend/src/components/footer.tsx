'use client';
import Link from 'next/link';
import Image from 'next/image';
import CodevPlay from "../../public/codevplay-white.svg"
import { useEffect, useState } from 'react'
const Footer = () => {
    const [localTime, setLocalTime] = useState<string | null>(null);
    const [currentYear, setCurrentYear] = useState<string | null>(null);

    useEffect(() => {
        setLocalTime(new Date().toLocaleTimeString());
        setCurrentYear(new Date().getFullYear().toString());
        const timer = setInterval(() => {
            setLocalTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

  return (
    <footer id="footer" className="bg-linear-to-r from-[#1A173E] from-50% to-black text-white">
        <div className="max-w-300 mx-auto p-8">
        <div className="mb-24 flex flex-col md:flex-row gap-12 justify-between items-start">
            {/* Column 1: Logo + Description */}
            <div className="flex-1 min-w-56">
                <Link href="/">
                    <Image src={CodevPlay} alt="CodevPlay Logo" className='object-contain w-42 h-12'/>
                </Link>
                <p className="mt-3 text-sm text-neutral-300 max-w-96">
                    Where Codev hangout and play — a friendly space to experiment, learn, and build together.
                </p>
            </div>

            {/* Column 2: Explore Links */}
            <nav aria-label="Explore" className="flex-1 min-w-44">
                <h3 className="text-base font-bold text-neutral-300">Explore</h3>
                <ul className="mt-3 space-y-2 text-sm [&>li]:hover:translate-x-1.5 [&>li]:transition-all [&>li]:w-fit">
                    <li><Link href="/" className="text-neutral-400 hover:text-white transition-colors duration-300">Home</Link></li>
                    <li><Link href="/about" className="text-neutral-400 hover:text-white transition-colors duration-300">About</Link></li>
                    <li><Link href="/playground" className="text-neutral-400 hover:text-white transition-colors duration-300">Playground</Link></li>
                    <li><Link href="/community" className="text-neutral-400 hover:text-white transition-colors duration-300">Community</Link></li>
                </ul>
            </nav>

            {/* Column 3: Resources Links */}
            <nav aria-label="Resources" className="flex-1 min-w-44">
                <h3 className="text-base font-bold text-neutral-300">Resources</h3>
                <ul className="mt-3 space-y-2 text-sm [&>li]:hover:translate-x-1.5 [&>li]:transition-all [&>li]:w-fit">
                    <li><Link href="/docs" className="text-neutral-400 hover:text-white transition-colors duration-300">Docs</Link></li>
                    <li><Link href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors duration-300">GitHub</Link></li>
                    <li><Link href="/contact" className="text-neutral-400 hover:text-white transition-colors duration-300">Contact</Link></li>
                    <li><Link href="/terms" className="text-neutral-400 hover:text-white transition-colors duration-300">Terms</Link></li>
                </ul>
            </nav>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-neutral-500 py-2"></div>
            <div className="flex justify-between">
                <div>
                <span className="text-neutral-600 font-medium">Version</span>
                <p className="text-sm font-extralight mt-2">
                    &copy;{currentYear ? ` ${currentYear}` : ''} Codebility. All Rights Reserved
                </p>
                </div>
                <div>
                <span className="text-neutral-600 font-medium">Local Time</span>
                <p className="text-sm font-extralight mt-2">
                    {localTime ? localTime : ''}
                </p>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer;