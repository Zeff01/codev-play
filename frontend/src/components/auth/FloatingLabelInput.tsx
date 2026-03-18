"use client";

import { InputHTMLAttributes, ReactNode } from "react";

interface FloatingLabelInputProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label: string;
    hasError?: boolean;
    rightAdornment?: ReactNode;
}

const BASE_INPUT_CLASSES =
    "border-b border-gray-300 py-1 focus:border-b-2 focus:border-purple-700 transition-colors focus:outline-none peer bg-inherit w-full text-white";
const ERROR_INPUT_CLASSES = "border-red-400 focus:border-red-500";

export function FloatingLabelInput({
    id,
    label,
    hasError,
    rightAdornment,
    className,
    ...inputProps
}: FloatingLabelInputProps) {
    return (
        <div className="relative mb-8">
            <input
                id={id}
                placeholder=""
                className={`${BASE_INPUT_CLASSES} ${hasError ? ERROR_INPUT_CLASSES : ""} ${className ?? ""}`}
                {...inputProps}
            />
            <label
                htmlFor={id}
                className="absolute -top-4 text-xs left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-purple-700 peer-placeholder-shown:top-1 peer-placeholder-shown:text-sm text-white"
            >
                {label}
            </label>
            {rightAdornment && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                    {rightAdornment}
                </div>
            )}
        </div>
    );
}
