import express, { Request, Response } from "express";
import passport from "passport";

export const googleRouter = express.Router();

googleRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile"] })
);

googleRouter.get(
  "/google/redirect",
  passport.authenticate("google", { failureRedirect: "/google" }),
  (req: Request, res: Response) => {
    res.send("Google login success");
  }
);
