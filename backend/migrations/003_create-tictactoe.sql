CREATE TABLE tictactoe (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_x INT,
  player_o INT,
  board JSONB NOT NULL,
  current_player CHAR(1) NOT NULL,
  status VARCHAR(20) NOT NULL,
  winner CHAR(1),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);