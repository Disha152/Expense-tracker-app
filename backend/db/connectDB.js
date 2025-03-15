import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load .env from backend folder
const envPath = path.resolve("backend/.env");
console.log(`🟢 Loading environment variables from: ${envPath}`);
dotenv.config({ path: envPath });

// Debugging: Check if MONGO_URI is loaded
console.log("🔍 MONGO_URI:", process.env.MONGO_URI ? "Loaded ✅" : "Not Loaded ❌");

export const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in .env file");
        }
        
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`❌ Database Connection Error: ${err.message}`);
        process.exit(1);
    }
};
