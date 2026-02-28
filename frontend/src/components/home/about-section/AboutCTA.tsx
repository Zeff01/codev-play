import { Button } from "@/components/ui/button";

export default function AboutCTA() {
    return (
        <div className="text-center">
            <h3 className='CTA text-3xl font-bold mb-6 font-["Outfit"] text-gray-900 dark:text-white'>
                Ready to Join the Fun?
            </h3>

            <p className='CTA mb-8 text-lg max-w-2xl mx-auto font-["Roboto"] text-gray-600 dark:text-gray-400'>
                Start playing today and become part of a thriving community of
                developers and gamers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="CTA px-8 py-3 text-lg font-semibold tracking-wide bg-linear-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-size-[200%_100%] transition-all duration-500 hover:bg-position-[100%_0] hover:shadow-[0_0_30px_rgba(99,102,241,0.45)] hover:-translate-y-0.5 active:translate-y-px">
                    Join Now
                </Button>

                <Button
                    variant="outline"
                    className="CTA px-8 py-3 text-lg font-medium border-gray-300 dark:border-white/20 text-gray-900 dark:text-white bg-white/80 dark:bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:-translate-y-px hover:shadow-md"
                >
                    Explore Games
                </Button>
            </div>
        </div>
    );
}
