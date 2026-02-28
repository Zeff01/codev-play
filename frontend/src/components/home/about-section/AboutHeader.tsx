export default function AboutHeader() {
    return (
        <div className="text-center mb-20">
            <h2 className='about-title text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-["Outfit"] text-foreground'>
                About{" "}
                <span className="bg-linear-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
                    Codev Play
                </span>
            </h2>

            <p className='about-title text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-["Roboto"]'>
                A vibrant community where coders play, learn, and build together
            </p>
        </div>
    );
}
