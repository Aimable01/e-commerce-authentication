import express from "express";
import { register } from "../../controllers/authControllers/authControllers";
import { login } from "../../controllers/authControllers/authControllers";

export const authRouter = express.Router();
authRouter.post("/register", register);
authRouter.post("/login", login);
