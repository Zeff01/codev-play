/* RPS choice validation */
export const RPSChoice = ["R", "P", "S"];
export type RPSType = "R" | "P" | "S";
export type Player = 1 | 2 | 0;

export const isValidRPSMove = (choice: string): boolean => {
  return RPSChoice.includes(choice);
};

/* Winner Validation, has Best-Of-N support */
export const checkWinner = (
  p1_points: number,
  p2_points: number,
  n: number,
): Player => {
  const targetPoints = Math.floor(n / 2) + 1;
  if (p1_points >= targetPoints) {
    return 1;
  } else if (p2_points >= targetPoints) {
    return 2;
  }
  return 0;
};

/* Score Determination */

export const checkScore = (p1_choice: RPSType, p2_choice: RPSType): number => {
  const winCons: Record<RPSType, RPSType> = {
    R: "S",
    P: "R",
    S: "P",
  };
  if (p1_choice === p2_choice) {
    return 0; //tie
  }

  return winCons[p1_choice] == p2_choice ? 1 : 2;
};
