CREATE TABLE Games (
    game_id SERIAL PRIMARY KEY,

    white_player_id INTEGER NOT NULL REFERENCES users(id),
    black_player_id INTEGER NOT NULL REFERENCES users(id),

    start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,

    status VARCHAR(20) NOT NULL DEFAULT 'ongoing'
        CHECK (status IN ('playing','checkmate','resigned','draw','stalemate','disconnected')),

    winner VARCHAR(5)
        CHECK (winner IN ('white','black')),

    time_control VARCHAR(20),
    white_time_left INTEGER,
    black_time_left INTEGER,
    last_move_at TIMESTAMPTZ,
    fen_position TEXT NOT NULL,
    pgn_data TEXT,

    activeColor CHAR(1) NOT NULL
        CHECK (activeColor IN ('w','b')),
    is_check BOOLEAN,
    draw_offer_by INTEGER,
    draw_status VARCHAR(20) DEFAULT 'none',
    last_draw_offer_at TIMESTAMPTZ
);