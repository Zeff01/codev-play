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
            variant="outline"
            className={`
        w-36 h-36
        flex flex-col items-center justify-center gap-3
        rounded-2xl
        transition-all duration-200

        hover:scale-105 active:scale-95

        ${selected ? "ring-2 ring-primary scale-105" : ""}

        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}

        dark:bg-[#39327C]
        dark:hover:bg-[#2f2966]
        dark:border-purple-400/30
        dark:text-purple-200
      `}
        >
            <div className="text-foreground dark:text-purple-200">{icon}</div>

            <span className="text-base font-semibold">{label}</span>
        </Button>
    );
}
