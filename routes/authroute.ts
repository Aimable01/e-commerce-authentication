import express from "express";
import { register } from "../controllers/authControllers";
import { login } from "../controllers/authControllers";

export const authRouter = express.Router();
authRouter.post("/register", register);
authRouter.post("/login", login);
