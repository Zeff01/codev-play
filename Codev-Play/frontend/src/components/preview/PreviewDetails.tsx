import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { PreviewDetailProps } from "@/types/preview";

export default function GameDetails({
  name,
  description,
  genre,
  howToPlay,
}: PreviewDetailProps) {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-6 text-center md:text-start">
      <h1 className="preview-detail text-4xl lg:text-6xl font-bold">{name}</h1>
      <p className="preview-detail text-sm lg:text-xl">{description}</p>
      <div className="flex justify-center md:justify-start space-x-2.5">
        {genre?.map((item, index) => (
          <span
            key={item}
            className={`preview-detail rounded-xl px-3 py-1 text-xs lg:text-sm ${
              index === 0 ? "bg-emerald-500" : "bg-amber-500"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
      <div className="mt-5 lg:mt-10">
        <h2 className="preview-detail text-sm font-bold mb-2 lg:text-lg">
          How to Play:
        </h2>
        <p className="preview-detail text-sm lg:text-sm">{howToPlay}</p>
      </div>
      <div className="preview-detail flex justify-center md:justify-start gap-2 md:gap-4">
        <Button className="px-8 py-3 text-md lg:text-lg cursor-pointer bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-size-[200%_100%] transition-all duration-500 ease-out hover:bg-position-[100%_0] hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-px active:shadow-md focus-visible:ring-2 focus-visible:ring-indigo-400">
          Play Now
        </Button>
        <Button
          onClick={() => {
            router.push("/");
          }}
          className="px-8 py-3 text-md lg:text-lg bg-transparent border hover:bg-white/10 cursor-pointer"
        >
          Back to Games
        </Button>
      </div>
    </div>
  );
}
