import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers || {}),
                },
                ...options,
            },
        );

        if (!response.ok) {
            const errorData = await response.json();
            // Include validation details when available for better client-side messages
            const details = errorData?.error?.details;
            const detailMsg = Array.isArray(details)
                ? details.map((d: any) => d.msg || JSON.stringify(d)).join("; ")
                : "";

            throw new Error(
                [errorData.error.message, detailMsg]
                    .filter(Boolean)
                    .join(" - "),
            );
        }

        return response.json();
    } catch (error: any) {
        console.error("API Fetch Error:", error.message);
        throw error;
    }
}
