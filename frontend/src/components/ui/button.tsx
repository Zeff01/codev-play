import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "default" | "outline" | "ghost";
}

export function Button({ className = "", variant = "default", ...props }: ButtonProps) {
  const base = "px-4 py-2 rounded-lg font-medium transition-all active:scale-95";
  const variants = {
    default: "bg-blue-600 text-white hovering:bg-blue-700",
    outline: "border border-gray-300 hover:bg-gray-100",
    ghost: "hover:bg-gray-600",
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props}></button>;
}
