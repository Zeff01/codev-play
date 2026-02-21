"use client";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import Pacman from "../../../public/pacman.png";
import Chess from "../../../public/chess.png";
import Tictactoe from "../../../public/tictactoe.png";
import Tetris from "../../../public/tetris.png";
import Snake from "../../../public/snake.png";
import Minesweeper from "../../../public/minesweeper.png";

interface GameGridCardProps {
  name: string;
  image: StaticImageData;
}

function GameGridCard({ image, name }: GameGridCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/10 p-4 hover:border-purple-500/50 hover:bg-white/5 transition-all duration-300 group hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={name}
          width={500}
          height={500}
          className="object-cover"
        />
      </div>
      <h3 className="mt-3 text-base font-bold">{name}</h3>
    </div>
  );
}

export default function GameSection() {
  return (
    <section className="mx-auto max-w-6xl px-8 pt-28 pb-20 text-center font-['Outfit']">
      <h3 className="mb-10 text-4xl font-bold tracking-tight text-white">
        Available Game
      </h3>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-3">
        <Link href="/preview/pacman">
          <GameGridCard name="Pacman" image={Pacman} />
        </Link>
        <Link href="/preview/chess">
          <GameGridCard name="Chess" image={Chess} />
        </Link>
        <Link href="/preview/tictactoe">
          <GameGridCard name="Tic Tac Toe" image={Tictactoe} />
        </Link>
        <Link href="/preview/tetris">
          <GameGridCard name="Tetris" image={Tetris} />
        </Link>
        <Link href="/preview/snake">
          <GameGridCard name="Snake" image={Snake} />
        </Link>
        <Link href="/preview/minesweeper">
          <GameGridCard name="Minesweeper" image={Minesweeper} />
        </Link>
      </div>
    </section>
  );
}
