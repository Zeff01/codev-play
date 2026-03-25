import Image from "next/image";
import { gameImages } from "@/data/gameImage";

export default function HeroImages() {
  const rows: ("spacer" | (typeof gameImages)[number])[][] = [
    ["spacer", "spacer", gameImages[0]],
    ["spacer", gameImages[1], gameImages[2]],
    [gameImages[3], gameImages[4], gameImages[5]],
  ];

  return (
    <div className="flex-1 flex items-center h-[calc(100vh-150px)]">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-6 w-full lg:w-lg xl:w-full p-0 py-8 lg:py-8 lg:px-4">
        {rows.flat().map((item, index) => {
          if (item === "spacer") {
            return <div key={`spacer-${index}`} className="hidden xl:block" />;
          }
          return (
            <Image
              key={item.id}
              data-tilt
              data-tilt-reverse
              data-tilt-scale="1.1"
              src={item.src}
              alt={item.alt}
              className="hero-image opacity-0 blur-[10px] bg-white/10 backdrop-blur-md rounded-lg p-2.5 border border-white/20 hover:border-purple-800/50 hover:shadow-[0_0_20px_rgba(151,71,255,0.6)]"
            />
          );
        })}
      </div>
    </div>
  );
}
