// Import mongoose to interact with MongoDB
import mongoose from "mongoose";

/**
 * connectDb
 * -----------------------
 * Connects to MongoDB using Mongoose.
 * Ensures a single connection is reused across the app
 * to prevent multiple connections in serverless environments.
 */
const connectDb = async () => {
    // If already connected (readyState 1 = connected), skip reconnection
    if (mongoose.connection.readyState >= 1) {
        console.log("MongoDB already connected");
        return;
    }

    try {
        // Attempt to connect to MongoDB using the connection string from environment variables
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,    // Parses connection string correctly
            useUnifiedTopology: true, // Uses new MongoDB driver engine
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        // Log and throw an error if connection fails
        console.error("MongoDB connection error:", error);
        throw new Error("Failed to connect to MongoDB");
    }
};

// Export the function so it can be used wherever a DB connection is needed
export default connectDb;
