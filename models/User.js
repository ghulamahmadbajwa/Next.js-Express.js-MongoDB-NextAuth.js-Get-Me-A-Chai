import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        profilepic: { type: String },
        coverpic: { type: String },
    },
    { timestamps: true } // This automatically manages createdAt & updatedAt
);

// Check if the model already exists before defining it
const User = mongoose.models.User || model("User", UserSchema);

export default User;
