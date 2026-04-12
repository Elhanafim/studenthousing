import dotenv from "dotenv";
import path from "path";
dotenv.config();

console.log("DB URL Length:", process.env.DATABASE_URL?.length);
console.log("DB URL Start:", process.env.DATABASE_URL?.substring(0, 10));
