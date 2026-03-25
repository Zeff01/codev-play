
CREATE TABLE rockpaperscissors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    player_one INT,
    player_two INT,

    p1_choice CHAR(1) CHECK (p1_choice IN ('R', 'P', 'S')),
    p2_choice CHAR(1) CHECK (p2_choice IN ('R', 'P', 'S')),

    p1_points INT DEFAULT 0,
    p2_points INT DEFAULT 0,

    current_round INT DEFAULT 1,
    best_of_N INT NOT NULL,

    status VARCHAR(20) NOT NULL, /*IN_PROGRESS OR WIN*/
    winner INT CHECK (winner IN (1, 2)), 
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)