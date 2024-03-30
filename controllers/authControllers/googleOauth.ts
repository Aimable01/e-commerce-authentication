import dotenv from "dotenv";
import { VerifyCallback } from "jsonwebtoken";
import passport, { Profile } from "passport";
import {
  Strategy as GoogleStrategy,
  StrategyOptions,
} from "passport-google-oauth20";
import { pool } from "../../database/dbConn";

dotenv.config();

passport.serializeUser((user: any, done) => {
  done(null, user.id);
  console.log(user.id);
  console.log("this  is the serialize user block");
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = (
      await pool.query(`SELECT id, fullName FROM users WHERE id = $1`, [id])
    ).rows[0];
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

const googleStrategyOptions: StrategyOptions = {
  clientID: process.env.clientID!,
  clientSecret: process.env.clientSecret!,
  callbackURL: "/auth/google/redirect",
};

passport.use(
  new GoogleStrategy(
    googleStrategyOptions,
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);
        const user = (
          await pool.query(`SELECT id, fullName FROM users WHERE id = $1`, [
            profile.id,
          ])
        ).rows[0];
        if (!user) {
          const newUser = await pool.query(
            `INSERT INTO users(id, fullName) VALUES($1,$2)`,
            [profile.id, profile.displayName]
          );
          done(null, newUser.rows[0]);
        } else {
          done(null, user);
        }
      } catch (error) {
        console.error(`An error in google oauth: ${error}`);
      }
    }
  )
);
