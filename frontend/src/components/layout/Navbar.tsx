"use client";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import CodevPlay from "../../../public/codevplay-white.svg";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const Header = () => {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    // animate background + shadow when user scrolls past threshold
    const bgAnim = gsap.to(".menu-bar", {
      backgroundColor: "rgba(0,0,0,0.65)",
      boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
      duration: 0.28,
      paused: true,
    });

    const st = ScrollTrigger.create({
      start: "top+=200 top",
      onEnter: () => bgAnim.play(),
      onLeaveBack: () => bgAnim.reverse(),
    });

    return () => {
      bgAnim.kill();
      st.kill();
    };
  }, []);

  useEffect(() => {
    if (!overlayRef.current) return;
    tl.current = gsap.timeline({ paused: true }).to(overlayRef.current, {
      duration: 0.45,
      x: "0%",
      ease: "power4.out",
    });

    // cleanup
    return () => {
      tl.current?.kill();
      tl.current = null;
    };
  }, []);

  useEffect(() => {
    if (tl.current) {
      if (isMenuOpen) {
        tl.current.play();
      } else {
        tl.current.reverse();
      }
    }
  }, [isMenuOpen]);

  useEffect(() => {
    gsap.to(".menu-bar", {
      y: 0,
      duration: 1,
      ease: "power4.Out",
    });
  }, []);

  const onHashClick =
    (hash: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const id = hash.replace("#", "");
      const el = document.getElementById(id) || document.querySelector(hash);
      if (el) {
        (el as HTMLElement).scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        // update URL hash without jumping
        history.replaceState(null, "", `#${id}`);
      } else {
        // fallback (navigates if section not on current page)
        window.location.href = hash;
      }
    };
  return (
    <div className="menu-bar fixed top-0 left-0 w-full z-20 -translate-y-20">
      <div className="max-w-450 w-full mx-auto px-8 py-4 flex justify-between items-center text-white">
        <div className="menu-logo font-semibold">
          <Link href="/">
            <Image
              src={CodevPlay}
              alt="CodevPlay Logo"
              className="object-contain w-42 h-12"
            />
          </Link>
        </div>
        <div className="menu-open hidden md:block">
          <ul className='flex items-center h-full text-xl font-["Outfit"] [&>li>a]:py-7 [&>li>a]:px-6 [&>li>a]:transition-colors [&>li>a]:duration-500 [&>li>a:hover]:bg-black/80 [&>li>a:hover]:font-medium [&>li>a:hover]:text-purple-800'>
            <li>
              <Link href="#home" onClick={onHashClick("#home")}>
                Home
              </Link>
            </li>
            <li>
              <Link href="#about" onClick={onHashClick("#about")}>
                About
              </Link>
            </li>
            <li>
              <Link href="#showcase" onClick={onHashClick("#showcase")}>
                Explore
              </Link>
            </li>
            <li>
              <Button
                onClick={() => router.push("/login")}
                className="mx-4 px-8 text-lg cursor-pointer bg-linear-to-r hover:text-white hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)]"
              >
                Sign In
              </Button>
            </li>
          </ul>
        </div>
        <button className="block md:hidden cursor-pointer" onClick={toggleMenu}>
          <Menu className="text-2xl hover:text-purple-800 transition-colors duration-300" />
        </button>
        {/* Sidebar */}
        <div
          ref={overlayRef}
          className="fixed top-0 right-0 h-dvh w-full sm:w-62.5 z-20 shadow-lg bg-black/10 backdrop-blur-xl translate-x-256"
        >
          <div className="p-6 flex justify-between items-center">
            <Link href="/">
              <Image
                src={CodevPlay}
                alt="CodevPlay Logo"
                className="object-contain w-42 sm:w-32 h-12"
              />
            </Link>
            <button className="cursor-pointer" onClick={toggleMenu}>
              <X className="text-2xl hover:rotate-90 hover:text-purple-800 transition-all duration-300" />
            </button>
          </div>

          {/* optimized: make each anchor a block that fills the container so hover covers full width */}
          <ul
            className='list-none w-full flex flex-col justify-center items-start text-xl font-["Outfit"]
                  [&>li]:w-full [&>li>a]:block [&>li>a]:w-full [&>li>a]:px-6 [&>li>a]:py-4
                  [&>li>a]:transition-colors [&>li>a:hover]:bg-black/80 [&>li>a:hover]:font-medium [&>li>a:hover]:text-purple-800'
          >
            <li>
              <Link
                href="#home"
                onClick={onHashClick("#home")}
                className="block w-full"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="#about"
                onClick={onHashClick("#about")}
                className="block w-full"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="#showcase"
                onClick={onHashClick("#showcase")}
                className="block w-full"
              >
                Explore
              </Link>
            </li>
            <li>
              <Button
                onClick={() => router.push("/login")}
                className="mx-4 my-4 px-8 text-lg cursor-pointer hover:bg-[#9747FF] hover:text-white"
              >
                Sign In
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
