import express, { NextFunction, Request, Response } from "express";

const authCheck = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) res.redirect("/auth/google");
  else next();
};

export const homeRouter = express.Router();

homeRouter.get("/", authCheck, (req: Request, res: Response) => {
  res.send("Welcome to the home page");
});
