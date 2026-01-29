// lib/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env explicitly from server folder
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    console.log("Loaded MONGO_URI:", mongoURI); // debug

    if (!mongoURI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error.message);
    throw error;
  }
};
