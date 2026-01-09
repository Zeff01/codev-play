import { pool } from "../config/db"


export const createUser = async (email:string, username:string, hashedPassword:string) => {

    const result = await pool.query(
        "INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING *",[email,username,hashedPassword]          
    );
    return result.rows[0]
}

export const findUserByEmail = async (email: string) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0];
};

export const findUserByUsername = async (username: string) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  return result.rows[0];
};

export const findUserByLogin = async (value: string) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE username = $1 OR email = $1",
    [value]
  );
  return result.rows[0];
};


