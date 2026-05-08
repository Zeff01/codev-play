CREATE TABLE games (
    game_id SERIAL PRIMARY KEY,

    white_player_id INTEGER NOT NULL,
    black_player_id INTEGER NOT NULL,

    start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,

    status VARCHAR(20) NOT NULL DEFAULT 'ongoing'
        CHECK (status IN ('ongoing','checkmate','resigned','draw','stalemate','timeout')),

    winner VARCHAR(5)
        CHECK (winner IN ('white','black')),

    time_control VARCHAR(20),
    white_time_left INTEGER,
    black_time_left INTEGER,
    last_move_at BIGINT,
    fen_position TEXT NOT NULL,
    pgn_data TEXT,

    current_turn CHAR(1) NOT NULL
        CHECK (current_turn IN ('w','b')),

    is_check BOOLEAN DEFAULT false,
    draw_offer_by INTEGER,
    draw_status VARCHAR(20) DEFAULT 'none'
);