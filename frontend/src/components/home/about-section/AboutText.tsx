export default function AboutText() {
    return (
        <div className="flex flex-col gap-10">
            <div>
                <h3 className='content text-2xl md:text-3xl font-bold mb-4 font-["Outfit"] text-foreground'>
                    Our Mission
                </h3>

                <p className='content text-muted-foreground leading-7 text-lg font-["Roboto"]'>
                    Codev Play is a platform designed for developers and
                    enthusiasts who want to explore gaming, competitive coding,
                    and collaborative development. We believe that learning
                    should be fun, and building should never be a solo journey.
                </p>
            </div>

            <div>
                <h3 className='content text-2xl md:text-3xl font-bold mb-4 font-["Outfit"] text-foreground'>
                    What We Offer
                </h3>

                <ul className='space-y-4 text-muted-foreground text-lg font-["Roboto"]'>
                    <li className="content flex items-start gap-3">
                        <span className="text-purple-500 text-2xl mt-1">
                            🎮
                        </span>
                        <span>
                            <strong className="text-foreground">
                                Classic Games Reimagined
                            </strong>{" "}
                            — Play Tic-Tac-Toe, Chess, Snake, and more with real
                            players in real time
                        </span>
                    </li>

                    <li className="content flex items-start gap-3">
                        <span className="text-cyan-500 text-2xl mt-1">⚡</span>
                        <span>
                            <strong className="text-foreground">
                                Competitive Fun
                            </strong>{" "}
                            — Track your stats, climb the leaderboards, and
                            showcase your skills
                        </span>
                    </li>

                    <li className="content flex items-start gap-3">
                        <span className="text-purple-500 text-2xl mt-1">
                            👥
                        </span>
                        <span>
                            <strong className="text-foreground">
                                Community First
                            </strong>{" "}
                            — Connect with developers, form friendships, and
                            collaborate on projects
                        </span>
                    </li>

                    <li className="content flex items-start gap-3">
                        <span className="text-cyan-500 text-2xl mt-1">🚀</span>
                        <span>
                            <strong className="text-foreground">
                                Learn & Grow
                            </strong>{" "}
                            — Improve your coding and strategic thinking through
                            gameplay
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
