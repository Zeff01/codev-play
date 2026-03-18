"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function useBackdropAnimation(showRegister: boolean) {
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    useEffect(() => {
        tlRef.current = gsap.timeline({ paused: true });
        tlRef.current.fromTo(
            ".backdrop",
            { right: "0" },
            { right: "50%", duration: 0.5, ease: "power1.inOut" },
        );
    }, []);

    useEffect(() => {
        if (!tlRef.current) return;
        if (showRegister) {
            tlRef.current.play();
        } else {
            tlRef.current.reverse();
        }
    }, [showRegister]);
}
