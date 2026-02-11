import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const isLocal = process.env.DATABASE_URL?.includes('localhost') || process.env.DATABASE_URL?.includes('127.0.0.1');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false }
});

pool.on("connect", () => {
  console.log("✅ Database connected (Neon)");
});

pool.on("error", (err) => {
  console.error("❌ Database error:", err);
  process.exit(1);
});

export const query = (text, params) => pool.query(text, params);
export default pool;
