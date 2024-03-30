import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { pool } from "./database/dbConn";
import { authRouter } from "./routes/authRoutes/authroute";
import { googleRouter } from "./routes/authRoutes/googleOauthRoute";
import { homeRouter } from "./routes/authRoutes/homeRoute";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());

require("./controllers/authControllers/googleOauth.ts");

// the session
app.use(
  session({
    secret: process.env.secretKey!,
    resave: false,
    saveUninitialized: false,
  })
);

// middle ware
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/auth2", authRouter);
app.use("/auth", googleRouter);
app.use("/home", homeRouter);
// connect to database
pool
  .connect()
  .then(() => console.log("Connected to pool successfully"))
  .catch((e) => console.log(`An error connecting to db: ${e}`));

app.listen(3000, () => console.log("App running on port 3000."));
