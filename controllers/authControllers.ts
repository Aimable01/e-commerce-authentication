import { pool } from "../database/dbConn";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

pool
  .connect()
  .then(() => {
    pool.query(`CREATE TABLE IF NOT EXISTS users(
        id TEXT PRIMARY KEY NOT NULL,
        fullName VARCHAR(200) NOT NULL,
        email VARCHAR(200) NOT NULL UNIQUE,
        password TEXT NOT NULL
    )`);
  })
  .catch((err) => console.log(`An error in creating table users: ${err}`));

// user register
export const register = async (req: Request, res: Response): Promise<void> => {
  const { fullName, email, password } = req.body;
  try {
    const id = await uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users(id,fullName,email,password) VALUES($1,$2,$3,$4)`,
      [id, fullName, email, hashedPassword]
    );
    res.status(200).json({ message: "user register successful" });
  } catch (error) {
    console.error(`An error in register: ${error}`);
    res.status(400).json({ message: "error in register" });
  }
};

// user login
