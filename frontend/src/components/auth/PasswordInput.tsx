"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FloatingLabelInput } from "./FloatingLabelInput";

interface PasswordInputProps {
    id: string;
    label: string;
    value: string;
    hasError?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PasswordInput({
    id,
    label,
    value,
    hasError,
    onChange,
}: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <FloatingLabelInput
            id={id}
            label={label}
            type={showPassword ? "text" : "password"}
            value={value}
            hasError={hasError}
            onChange={onChange}
            required
            rightAdornment={
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-gray-400 hover:text-purple-700 focus:outline-none duration-200 cursor-pointer"
                    aria-label={
                        showPassword ? "Hide password" : "Show password"
                    }
                >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
            }
        />
    );
}
