CREATE TABLE Moves (
    move_id SERIAL PRIMARY KEY,
    game_id INTEGER NOT NULL,
    move_number INTEGER NOT NULL,
    player_color CHAR(1) NOT NULL
        CHECK (player_color IN ('w','b')),
    from_square VARCHAR(2) NOT NULL,
    to_square VARCHAR(2) NOT NULL,
    piece VARCHAR(2),
    capture VARCHAR(5),
    promotion VARCHAR(2),
    notation VARCHAR(10) NOT NULL,
    fen_after TEXT NOT NULL,
    move_time INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_game
        FOREIGN KEY (game_id)
        REFERENCES Games(game_id)
        ON DELETE CASCADE
);