import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
interface RequestExtended extends Request {
  user?: any;
}

export const authenticateToken = (
  req: RequestExtended,
  res: Response,
  next: NextFunction
) => {
  const authHead = req.headers["authorization"];
  const token = authHead && authHead.split(" ")[1];
  if (!token) res.status(404).json({ message: "no token found" });

  jwt.verify(token!, process.env.secretKey!, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        res.status(400).json({ message: "Token expired. Please login again" });
      }
      res.status(400).json({ message: "Failed to verify token", err });
    }

    req.user = user;
    next();
  });
};
