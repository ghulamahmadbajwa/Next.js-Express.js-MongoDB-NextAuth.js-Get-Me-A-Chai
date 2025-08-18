// D:\BSCS\SUMMER\2\SIGMA WEB DEVELOPMENT\get-me-a-chai\db\connectDb.js
import mongoose from "mongoose";

const connectDb = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log("MongoDB already connected");
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw new Error("Failed to connect to MongoDB");
    }
};

export default connectDb;