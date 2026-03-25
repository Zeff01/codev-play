import { StaticImageData } from "next/image";

export interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export interface GameGridCardProps {
  name: string;
  image: StaticImageData;
}
