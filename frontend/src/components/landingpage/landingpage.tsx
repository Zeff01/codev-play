'use client';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Pacman from "../../../public/pacman.png"
import Chess from "../../../public/chess.png"
import Tictactoe from "../../../public/tictactoe.png"
import Tetris from "../../../public/tetris.png"
import Snake from "../../../public/snake.png"
import Minesweeper from "../../../public/minesweeper.png"
import Footer from '../footer';
import { Button } from '../ui/button';
import NavigationBar from './navbar';
import { useRouter } from 'next/navigation';
// @ts-ignore
const Tilt = require('./vanilla-tilt');

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  return (
    <div>
        <NavigationBar />
        <HeroSection />
        <AboutSection />
        <Footer />
    </div>
  )
}

function HeroSection() {
  const router = useRouter();
  const tl = useRef<gsap.core.Timeline | null>(null);
    useEffect(() => {
      tl.current = gsap.timeline();
        tl.current.to('.backdrop-gradient', 
        { opacity: 1, filter: 'blur(0px)', duration: 1.5, ease: "power1.inOut" })
        .to('.hero-title',
        { y: 0,
            opacity: 1,
            duration: 1,
            ease: "power4.Out",
            delay: 0.5,
            stagger: 0.2 }, "-=1.0")
        .fromTo('.hero-image', 
        { scale: 0.8 }, 
        { scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1,
            ease: "power4.inOut",
            delay: 0.3,
            stagger: 0.2 }, "-=1.75");

        const timeout = setTimeout(() => {
            const elements = document.querySelectorAll('[data-tilt]');
            elements.forEach((element) => {
                new Tilt(element);
            });
        }, 2500);

        return () => clearTimeout(timeout);

    }, []);

    return (
        <div>
            <section id="home" className='relative min-h-screen flex flex-col justify-center items-center text-white pt-14'>
                <div className="backdrop-gradient opacity-0 blur-[20px] absolute inset-0 -z-10 [background:radial-gradient(125%_125%_at_50%_20%,#000_40%,#63e_100%)]"></div>
                <div className='max-w-450 w-full mx-auto px-8 pb-4 pt-18 lg:pt-4 xl:py-4 flex flex-col lg:flex-row items-center justify-between gap-8'>
                    {/* Left side - Title and CTA */}
                    <div className='flex-1 flex flex-col justify-center'>
                        <h1 className='hero-title opacity-0 translate-y-12.5 text-4xl md:text-5xl lg:text-7xl font-bold font-["Outfit"] mb-6 leading-[0.9] max-w-2xl'>
                            UNLOCK ENDLESS FUN FILLED WITH <span className='whitespace-nowrap bg-linear-to-r from-purple-500  to-cyan-400 inline-block text-transparent bg-clip-text hover:text-shadow-[0_0_25px_rgba(99,102,241,0.6)] cursor-default duration-300'>CODEV PLAY</span>
                        </h1>
                        <p className='hero-title opacity-0 translate-y-12.5 text-lg md:text-xl text-gray-300 leading-6 mb-8 max-w-lg font-["Roboto"]'>
                            Where Codev hangout and play — a friendly space to experiment, learn, and build together.
                        </p>
                        <div className='hero-title opacity-0 translate-y-12.5 flex gap-4'>
                            <Button onClick={() => router.push('/login?view=register')} className='px-8 py-3 text-lg cursor-pointer bg-linear-to-r hover:text-white hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)]'>Get Started</Button>
                            <Button variant="outline" className='px-8 py-3 text-lg text-white border-white hover:bg-white/10 cursor-pointer'>Learn More</Button>
                        </div>
                    </div>

                    {/* Right side - Image/Illustration */}
                    <div className='flex-1 flex items-center h-[calc(100vh-150px)]'>
                        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-6 w-full lg:w-lg xl:w-full p-0 py-8 lg:py-8 lg:px-4'>
                            <div className='hidden xl:block'></div>
                            <div className='hidden xl:block'></div>
                              <Image data-tilt data-tilt-reverse data-tilt-scale="1.1" src={Pacman} alt="Pacman" className='hero-image opacity-0 blur-[10px] bg-white/10 backdrop-blur-md rounded-lg p-2.5 border border-white/20 hover:border-purple-800/50 hover:shadow-[0_0_20px_rgba(151,71,255,0.6)]'/>
                            <div className='hidden xl:block'></div>
                              <Image data-tilt data-tilt-reverse data-tilt-scale="1.1" src={Chess} alt="Chess" className='hero-image opacity-0 blur-[10px] bg-white/10 backdrop-blur-md rounded-lg p-2.5 border border-white/20 hover:border-purple-800/50 hover:shadow-[0_0_20px_rgba(151,71,255,0.6)] hover:z-10'/>
                              <Image data-tilt data-tilt-reverse data-tilt-scale="1.1" src={Tictactoe} alt="Tic Tac Toe" className='hero-image opacity-0 blur-[10px] bg-white/10 backdrop-blur-md rounded-lg p-2.5 border border-white/20 hover:border-purple-800/50 hover:shadow-[0_0_20px_rgba(151,71,255,0.6)]'/>
                              <Image data-tilt data-tilt-reverse data-tilt-scale="1.1" src={Tetris} alt="Tetris" className='hero-image opacity-0 blur-[10px] bg-white/10 backdrop-blur-md rounded-lg p-2.5 border border-white/20 hover:border-purple-800/50 hover:shadow-[0_0_20px_rgba(151,71,255,0.6)]'/>
                              <Image data-tilt data-tilt-reverse data-tilt-scale="1.1" src={Snake} alt="Snake" className='hero-image opacity-0 blur-[10px] bg-white/10 backdrop-blur-md rounded-lg p-2.5 border border-white/20 hover:border-purple-800/50 hover:shadow-[0_0_20px_rgba(151,71,255,0.6)]'/>
                              <Image data-tilt data-tilt-reverse data-tilt-scale="1.1" src={Minesweeper} alt="Minesweeper" className='hero-image opacity-0 blur-[10px] bg-white/10 backdrop-blur-md rounded-lg p-2.5 border border-white/20 hover:border-purple-800/50 hover:shadow-[0_0_20px_rgba(151,71,255,0.6)]'/>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

function AboutSection() {

    useEffect(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#about",
                start: "top 60%",
            }
        });
        
        tl.fromTo('.about-title', 
        { y: 50, opacity: 0 }, 
        {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power4.Out",
            stagger: 0.2
        });

        tl.fromTo('.content', 
        { y: 50, opacity: 0 }, 
        {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power4.Out",
            stagger: 0.2
        }, "-=0.5");

        tl.fromTo('.feature-card', 
        { scale: 0.8, opacity: 0, filter: 'blur(10px)' }, 
        { scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1,
            ease: "power4.inOut",
            delay: 0.3,
            stagger: 0.2,
        }, "-=0.75");

        tl.fromTo('.CTA', 
        { y: 50, opacity: 0 }, 
        { y: 0,
            opacity: 1,
            duration: 1,
            ease: "power4.Out",
            stagger: 0.2
        }, "-=0.5");
    }, []);

    return (
        <section id="about" className='relative min-h-screen flex flex-col justify-center items-center text-white pt-40 pb-20 overflow-hidden'>
            <div className="absolute inset-0 -z-10 [background:radial-gradient(125%_125%_at_50%_50%,rgba(99,102,241,0.1)_0%,rgba(168,85,247,0.05)_40%,transparent_100%)]"></div>
            
            <div className='max-w-6xl w-full mx-auto px-8'>
                {/* Header */}
                <div className='text-center mb-20'>
                    <h2 className='about-title text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-["Outfit"]'>
                        About <span className='bg-linear-to-r from-purple-500 to-cyan-400 inline-block text-transparent bg-clip-text'>Codev Play</span>
                    </h2>
                    <p className='about-title text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-["Roboto"]'>
                        A vibrant community where coders play, learn, and build together
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className='grid lg:grid-cols-2 gap-12 items-center mb-20'>
                    {/* Left Content */}
                    <div className='flex flex-col gap-6'>
                        <div>
                            <h3 className='content text-2xl md:text-3xl font-bold mb-4 font-["Outfit"]'>Our Mission</h3>
                            <p className='content text-gray-300 leading-7 text-lg font-["Roboto"]'>
                                Codev Play is a platform designed for developers and enthusiasts who want to explore gaming, competitive coding, and collaborative development. We believe that learning should be fun, and building should never be a solo journey.
                            </p>
                        </div>
                        <div>
                            <h3 className='content text-2xl md:text-3xl font-bold mb-4 font-["Outfit"]'>What We Offer</h3>
                            <ul className='space-y-3 text-gray-300 text-lg font-["Roboto"]'>
                                <li className='content flex items-start gap-3'>
                                    <span className='text-purple-400 text-2xl mt-1'>🎮</span>
                                    <span><strong className='text-white'>Classic Games Reimagined</strong> — Play Tic-Tac-Toe, Chess, Snake, and more with real players in real time</span>
                                </li>
                                <li className='content flex items-start gap-3'>
                                    <span className='text-cyan-400 text-2xl mt-1'>⚡</span>
                                    <span><strong className='text-white'>Competitive Fun</strong> — Track your stats, climb the leaderboards, and showcase your skills</span>
                                </li>
                                <li className='content flex items-start gap-3'>
                                    <span className='text-purple-400 text-2xl mt-1'>👥</span>
                                    <span><strong className='text-white'>Community First</strong> — Connect with developers, form friendships, and collaborate on projects</span>
                                </li>
                                <li className='content flex items-start gap-3'>
                                    <span className='text-cyan-400 text-2xl mt-1'>🚀</span>
                                    <span><strong className='text-white'>Learn & Grow</strong> — Improve your coding and strategic thinking through gameplay</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Visual */}
                    <div className='relative h-125 hidden lg:flex items-center justify-center'>
                        <div className='content absolute inset-0 bg-linear-to-t from-purple-500/20 to-cyan-400/10 rounded-2xl blur-3xl'></div>
                        <div className='relative z-10 grid grid-cols-2 gap-4'>
                            <div className='space-y-4'>
                                <div data-tilt data-tilt-reverse data-tilt-scale="1.1" className='content bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:border-purple-500/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] cursor-default'>
                                    <div className='text-6xl mb-2'>🎯</div>
                                    <p className='text-sm font-semibold'>Strategic</p>
                                </div>
                                <div data-tilt data-tilt-reverse data-tilt-scale="1.1" className='content bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:border-cyan-400/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] cursor-default'>
                                    <div className='text-6xl mb-2'>⚙️</div>
                                    <p className='text-sm font-semibold'>Technical</p>
                                </div>
                            </div>
                            <div className='space-y-4 mt-6'>
                                <div data-tilt data-tilt-reverse data-tilt-scale="1.1" className='content bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:border-purple-500/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] cursor-default'>
                                    <div className='text-6xl mb-2'>🌍</div>
                                    <p className='text-sm font-semibold'>Global</p>
                                </div>
                                <div data-tilt data-tilt-reverse data-tilt-scale="1.1" className='content bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:border-cyan-400/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] cursor-default'>
                                    <div className='text-6xl mb-2'>💡</div>
                                    <p className='text-sm font-semibold'>Innovative</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Cards */}
                <div className='grid md:grid-cols-3 gap-6 mb-20'>
                    <div className='feature-card'>
                        <FeatureCard 
                            icon="🎮" 
                            title="Multiple Games" 
                            description="From classic board games to arcade challenges, there's always something new to play and master."
                        />
                    </div>
                    <div className='feature-card'>
                        <FeatureCard 
                            icon="📊" 
                            title="Track Progress" 
                            description="Monitor your statistics, achievements, and ranking as you compete with players worldwide."
                        />
                    </div>
                    <div className='feature-card'>
                        <FeatureCard 
                            icon="🤝" 
                            title="Connect & Compete" 
                            description="Challenge friends, join tournaments, and build lasting relationships with the community."
                        />
                    </div>
                </div>

                {/* CTA */}
                <div className='text-center'>
                    <h3 className='CTA text-3xl font-bold mb-6 font-["Outfit"]'>Ready to Join the Fun?</h3>
                    <p className='CTA text-gray-400 mb-8 text-lg max-w-2xl mx-auto font-["Roboto"]'>
                        Start playing today and become part of a thriving community of developers and gamers.
                    </p>
                    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                        <Button className='CTA px-8 py-3 text-lg cursor-pointer bg-linear-to-r hover:text-white hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)]'>
                            Join Now
                        </Button>
                        <Button variant="outline" className='CTA px-8 py-3 text-lg text-white border-white hover:bg-white/10 cursor-pointer'>
                            Explore Games
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {

    return (
        <div className='feature bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]'>
            <div className='text-5xl mb-4'>{icon}</div>
            <h3 className='text-xl font-bold mb-3 font-["Outfit"]'>{title}</h3>
            <p className='text-gray-400 leading-6 font-["Roboto"]'>{description}</p>
        </div>
    )
}

export default LandingPage;