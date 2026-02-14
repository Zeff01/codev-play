import { Button } from "@/components/ui/button";

type Props = {
    icon: React.ReactNode;
    label: string;
    selected?: boolean;
    disabled?: boolean;
    onClick?: () => void;
};

export default function ChoiceButton({
    icon,
    label,
    selected,
    disabled,
    onClick,
}: Props) {
    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            className={`
        w-36 h-36
        flex flex-col items-center justify-center
        gap-3
        rounded-2xl
        text-white
        transition-all duration-200
        hover:scale-105 active:scale-95 cursor-pointer

        ${
            selected
                ? "bg-[#4b43a6] ring-2 ring-gray-500"
                : "bg-[#39327C] hover:bg-[#2f2966]"
        }

        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
        >
            {icon}
            <span className="text-base font-semibold">{label}</span>
        </Button>
    );
}
