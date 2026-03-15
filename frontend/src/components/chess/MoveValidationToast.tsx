"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import type { ValidationResult } from "@/store/chess/useChessStore";

interface Props {
    result: ValidationResult | null;
}

export default function MoveValidationToast({ result }: Props) {
    const lastResultRef = useRef<ValidationResult | null>(null);

    useEffect(() => {
        if (!result) return;
        // Deduplicate — only fire when result reference changes
        if (result === lastResultRef.current) return;
        lastResultRef.current = result;

        if (!result.valid) {
            toast.error(result.reason ?? "Illegal move", {
                duration: 2500,
                position: "bottom-center",
                classNames: {
                    toast: "font-roboto text-xs",
                },
            });
        }
    }, [result]);


    return null;
}