import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString: string = process.env.connectionString!;

export const pool = new Pool({
  connectionString: connectionString,
});
