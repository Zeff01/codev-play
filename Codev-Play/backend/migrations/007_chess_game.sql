CREATE TABLE Games (
    game_id SERIAL PRIMARY KEY,

    white_player_id INTEGER NOT NULL REFERENCES Users(id),
    black_player_id INTEGER NOT NULL REFERENCES Users(id),

    start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,

    status VARCHAR(20) NOT NULL DEFAULT 'ongoing'
        CHECK (status IN ('ongoing','checkmate','resigned','draw','stalemate','timeout')),

    winner VARCHAR(5)
        CHECK (winner IN ('white','black')),

    time_control VARCHAR(20),
    turn_time_left INTEGER 
    fen_position TEXT NOT NULL,
    pgn_data TEXT,

    current_turn CHAR(1) NOT NULL
        CHECK (current_turn IN ('w','b'))
    is_check BOOLEAN 
    draw_offer_by INTEGER NULL;
    draw_status VARCHAR(20) DEFAULT 'none'
);