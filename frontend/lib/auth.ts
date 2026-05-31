import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

const db = new Database("auth.sqlite");

export const auth = betterAuth({
  database: betterSqlite3(db),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "placeholder",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "placeholder",
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
});
