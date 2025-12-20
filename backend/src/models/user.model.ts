import { pool } from "../config/db"


export const createUser = async (email:string, username:string, password:string) => {

    const result = await pool.query(
        "INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING *",[email,username,password]          
    );
    return result.rows[0]
}

export const findUser= async (email:string, username:string) => {
    const result = await pool.query(
        "Select * FROM  user WHERE email = $1 OR username = $2",[email, username]
    )
    return result.rows[0]
}