export default function AboutVisual() {
    return (
        <div className="relative h-125 hidden lg:flex items-center justify-center">
            <div className="content absolute inset-0 bg-linear-to-t from-purple-500/20 to-cyan-400/10 rounded-2xl blur-3xl" />

            <div className="relative z-10 grid grid-cols-2 gap-4">
                <div className="space-y-4">
                    <div
                        data-tilt
                        data-tilt-reverse
                        data-tilt-scale="1.1"
                        className="content rounded-xl p-6 text-center transition-all duration-300 bg-white/70 dark:bg-white/5 backdrop-blur-md border border-gray-300 dark:border-white/10 hover:border-purple-500/60 hover:bg-white/90 dark:hover:bg-white/10 hover:shadow-[0_0_25px_rgba(168,85,247,0.35)]"
                    >
                        <div className="text-6xl mb-2">🎯</div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            Strategic
                        </p>
                    </div>

                    <div
                        data-tilt
                        data-tilt-reverse
                        data-tilt-scale="1.1"
                        className="content rounded-xl p-6 text-center transition-all duration-300 bg-white/70 dark:bg-white/5 backdrop-blur-md border border-gray-300 dark:border-white/10 hover:border-cyan-400/60 hover:bg-white/90 dark:hover:bg-white/10 hover:shadow-[0_0_25px_rgba(34,211,238,0.35)]"
                    >
                        <div className="text-6xl mb-2">⚙️</div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            Technical
                        </p>
                    </div>
                </div>

                <div className="space-y-4 mt-6">
                    <div
                        data-tilt
                        data-tilt-reverse
                        data-tilt-scale="1.1"
                        className="content rounded-xl p-6 text-center transition-all duration-300 bg-white/70 dark:bg-white/5 backdrop-blur-md border border-gray-300 dark:border-white/10 hover:border-purple-500/60 hover:bg-white/90 dark:hover:bg-white/10 hover:shadow-[0_0_25px_rgba(168,85,247,0.35)]"
                    >
                        <div className="text-6xl mb-2">🌍</div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            Global
                        </p>
                    </div>

                    <div
                        data-tilt
                        data-tilt-reverse
                        data-tilt-scale="1.1"
                        className="content rounded-xl p-6 text-center transition-all duration-300 bg-white/70 dark:bg-white/5 backdrop-blur-md border border-gray-300 dark:border-white/10 hover:border-cyan-400/60 hover:bg-white/90 dark:hover:bg-white/10 hover:shadow-[0_0_25px_rgba(34,211,238,0.35)]"
                    >
                        <div className="text-6xl mb-2">💡</div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            Innovative
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
