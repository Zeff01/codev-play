import dotenv from 'dotenv'; 
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config();


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});


const connectDB = async () => {
    try {
        await pool.connect();
        console.log('Connected to the database successfully.');
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};

export { connectDB, pool };