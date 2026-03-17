CREATE TABLE snakes (
    score_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    score INT NOT NULL,
    game_state JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
 );