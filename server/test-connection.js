import "dotenv/config.js";
import mongoose from "mongoose";

const connect = async () => {
    console.log("Testing MongoDB connection...");
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error("ERROR: MONGO_URI is undefined in .env file");
        return;
    }

    // Mask password for safe logging
    const maskedUri = uri.replace(/:([^@]+)@/, ":****@");
    console.log("Using URI:", maskedUri);

    try {
        // Attempt connection
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000 // Fail faster for testing (5 seconds)
        });
        console.log(`✅ SUCCESS! Connected to: ${conn.connection.host}`);
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("❌ CONNECTION FAILED");
        console.error(`Error Name: ${error.name}`);
        console.error(`Error Message: ${error.message}`);

        if (error.reason) console.error("Reason:", error.reason);

        console.log("\nPossible Causes:");
        console.log("1. IP Address not whitelisted in MongoDB Atlas.");
        console.log("2. Incorrect username or password in MONGO_URI.");
        console.log("3. Firewall/Network blocking the connection.");
        process.exit(1);
    }
};

connect();
