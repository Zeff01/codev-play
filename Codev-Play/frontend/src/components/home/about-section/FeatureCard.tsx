import { FeatureCardProps } from "@/types/home";

export default function FeatureCard({
    icon,
    title,
    description,
}: FeatureCardProps) {
    return (
        <div className="feature rounded-xl p-8 transition-all duration-300 group backdrop-blur-md bg-white/70 dark:bg-white/5 border border-gray-300 dark:border-white/10 hover:border-purple-500/60 hover:bg-white/90 dark:hover:bg-white/10 hover:shadow-[0_0_25px_rgba(168,85,247,0.35)]">
            <div className="text-5xl mb-4">{icon}</div>
            <h3 className='text-xl font-bold mb-3 font-["Outfit"] text-gray-900 dark:text-white'>
                {title}
            </h3>
            <p className='leading-6 font-["Roboto"] text-gray-600 dark:text-gray-400'>
                {description}
            </p>
        </div>
    );
}
