import Image from "next/image";
import { GameGridCardProps } from "@/types/home";

export default function GameGridCard({ name, image }: GameGridCardProps) {
  return (
    <div
      data-tilt
      data-tilt-reverse
      data-tilt-scale="1.1"
      className="game-card rounded-xl p-2 md:p-4 text-center transition-all duration-300 bg-white/70 dark:bg-white/5 backdrop-blur-md border border-gray-400 dark:border-gray-600 hover:border-purple-500/60 hover:bg-white/90 dark:hover:bg-white/10 hover:shadow-[0_0_25px_rgba(168,85,247,0.35)]"
    >
      <Image
        src={image}
        alt={name}
        width={500}
        height={500}
        className="object-cover"
      />
      <h3 className="mt-3 text-base font-bold">{name}</h3>
    </div>
  );
}
