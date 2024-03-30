import { pool } from "../../database/dbConn";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

pool
  .connect()
  .then(() => {
    pool.query(`CREATE TABLE IF NOT EXISTS users(
        id TEXT PRIMARY KEY NOT NULL,
        fullName VARCHAR(200) NOT NULL,
        email VARCHAR(200) UNIQUE,
        password TEXT 
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
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    //  check if user is registered
    const user = (
      await pool.query(`SELECT id,email,password FROM users WHERE email = $1`, [
        email,
      ])
    ).rows[0];
    if (!user) res.status(404).json({ message: "user not found" });

    //  check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      res.status(400).json({ message: "password do not match" });

    //  generate the token
    const token = jwt.sign({ id: user.id }, process.env.secretKey!, {
      expiresIn: "720h",
    });
    res.status(200).json({ user: user, token: token });
  } catch (error) {
    res.status(500).json({ message: `An error: ${error}` });
  }
};
