import { Button } from "@/components/ui/button";

type Props = {
    icon: React.ReactNode;
    label: string;
};

export default function ChoiceButton({ icon, label }: Props) {
    return (
        <Button
            className="
        w-36 h-36
        flex flex-col items-center justify-center
        gap-3
        rounded-2xl
        text-white
        bg-[#39327C] hover:bg-[#2f2966]
        transition-all duration-200
        hover:scale-105 active:scale-95
      "
        >
            {icon}
            <span className="text-base font-semibold">{label}</span>
        </Button>
    );
}
