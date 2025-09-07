import mongoose from "mongoose";

// Destructure Schema and model from mongoose
const { Schema, model } = mongoose;

/**
 * UserSchema
 * -----------------------
 * Defines the structure of a User document in MongoDB
 */
const UserSchema = new Schema(
    {
        // Full name of the user
        name: { type: String, required: true },

        // User's email (unique to avoid duplicates)
        email: { type: String, required: true, unique: true },

        // URL of the user's profile picture
        profilepic: { type: String },

        // URL of the user's cover picture
        coverpic: { type: String },

        // Stripe Customer ID for payment integration
        stripeId: { type: String },

        // Stripe secret key for API actions (optional, could be used for server-side Stripe operations)
        stripeSecretKey: { type: String }
    },
    {
        // Automatically adds 'createdAt' and 'updatedAt' timestamps
        timestamps: true
    }
);

// Prevent re-defining the model during Next.js hot reload
const User = mongoose.models.User || model("User", UserSchema);

export default User;
