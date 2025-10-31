// src/config/db.js
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

// Using DATABASE_URL from .env
export const sql = postgres(process.env.DATABASE_URL, {
  ssl: { rejectUnauthorized: false } // Required for Neon
});
