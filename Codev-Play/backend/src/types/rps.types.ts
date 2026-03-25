export type RPSGame = {
  player_one: number;
  player_two: number;
  p1_choice: string;
  p2_choice: string;
  p1_points: number;
  p2_points: number;

  current_round: number;
  best_of_N: number;

  status: string;
  winner: number;
  created_at: Date;
  updated_at: Date;
};

export const RPSChoice = ["R", "P", "S"];
export type RPSType = "R" | "P" | "S";

/*id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    player_one INT,
    player_two INT,

    p1_choice CHAR(1) CHECK (p1_choice IN ('R', 'P', 'S')),
    p2_choice CHAR(1) CHECK (p2_choice IN ('R', 'P', 'S')),

    p1_points INT DEFAULT 0,
    p2_points INT DEFAULT 0,

    current_round INT DEFAULT 1,
    best_of_N INT NOT NULL,

    status VARCHAR(20) NOT NULL, 
    winner INT CHECK (winner IN (1, 2)), 
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW() 
*/
