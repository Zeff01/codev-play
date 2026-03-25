import Image from "next/image";
import { PreviewImageProps } from "@/types/preview";

export default function GameImage({ name, image }: PreviewImageProps) {
  return (
    <div className="preview-image opacity-0 rounded-xl border border-white/10 bg-white/10 p-4 hover:border-purple-500/50 hover:bg-white/5 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
      <div className="relative w-full aspect-square overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={name}
          width={500}
          height={500}
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}
