import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HeroTitle() {
    const router = useRouter();

    return (
        <div className="flex-1 flex flex-col justify-center">
            <h1 className='hero-title opacity-0 translate-y-12.5 text-4xl md:text-5xl lg:text-7xl font-bold font-["Outfit"] mb-6 leading-[0.9] max-w-2xl'>
                UNLOCK ENDLESS FUN FILLED WITH{" "}
                <span className="whitespace-nowrap bg-linear-to-r from-purple-500  to-cyan-400 inline-block text-transparent bg-clip-text hover:text-shadow-[0_0_25px_rgba(99,102,241,0.6)] cursor-default duration-300">
                    CODEV PLAY
                </span>
            </h1>
            <p className='hero-title opacity-0 translate-y-12.5 text-lg md:text-xl text-gray-300 leading-6 mb-8 max-w-lg font-["Roboto"]'>
                Where Codev hangout and play — a friendly space to experiment,
                learn, and build together.
            </p>
            <div className="hero-title opacity-0 translate-y-12.5 flex gap-4">
                <Button
                    onClick={() => router.push("/login?view=register")}
                    size="lg"
                    className="relative overflow-hidden px-8 font-semibold tracking-wide bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-size-[200%_100%] transition-all duration-500 ease-out hover:bg-position-[100%_0] hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-px active:shadow-md focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                    Get Started
                </Button>

                <Button
                    variant="outline"
                    size="lg"
                    className="px-8 font-medium bg-transparent border-muted-foreground/30 transition-all duration-300 hover:bg-muted/60 hover:shadow-md hover:-translate-y-px active:translate-y-px focus-visible:ring-2 focus-visible:ring-muted-foreground"
                >
                    Learn More
                </Button>
            </div>
        </div>
    );
}
