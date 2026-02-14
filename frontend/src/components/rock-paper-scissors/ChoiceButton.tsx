import { ReactNode } from "react";

type Props = {
    label: string;
    icon: ReactNode;
};

export default function ChoiceButton({ label, icon }: Props) {
    return (
        <button className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 backdrop-blur px-6 py-5 transition hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            <div className="w-10 h-10">{icon}</div>
            <span>{label}</span>
        </button>
    );
}
