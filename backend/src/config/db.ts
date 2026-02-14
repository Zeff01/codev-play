import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;
import logger from "../utils/logger";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

const client = await pool.connect();

const connectDB = async () => {
  try {
    await pool.connect();
    logger.info("Database connected successfully.");
  } catch (error) {
    logger.error("Database connection error", { error });
    throw error;
  }
};

export { connectDB, pool, client };
