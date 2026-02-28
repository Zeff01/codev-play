import { RPSChoice, RPSType } from "@/types/rps.types";
import { Player } from "@/types/game.type";

export const isValidRPSMove = (choice: string): boolean => {
  return RPSChoice.includes(choice);
};

export const checkWinner = (p1_points: number, p2_points: number, n: number): Player => {
  const targetPoints = Math.floor(n / 2) + 1;
  console.log("TARGET POINTS: ", targetPoints);
  if (p1_points >= targetPoints) {
    return 1;
  } else if (p2_points >= targetPoints) {
    return 2;
  }
  return 0;
};

export const checkScore = (p1_choice: RPSType, p2_choice: RPSType): number => {
  const winCons: Record<RPSType, RPSType> = {
    R: "S",
    P: "R",
    S: "P",
  };
  if (p1_choice === p2_choice) {
    return 0;
  }

  return winCons[p1_choice] == p2_choice ? 1 : 2;
};
