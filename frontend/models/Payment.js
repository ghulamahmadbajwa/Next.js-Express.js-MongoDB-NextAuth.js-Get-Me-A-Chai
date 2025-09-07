import mongoose from "mongoose";

// Destructure Schema and model from mongoose
const { Schema, model } = mongoose;

/**
 * PaymentSchema
 * -----------------------
 * Defines the structure of a Payment document in MongoDB
 */
const PaymentSchema = new Schema(
    {
        // Name of the person making the payment
        name: { type: String, required: true },

        // Recipient or user ID the payment is for
        to_user: { type: String, required: true },

        // Order or transaction ID
        oid: { type: String, required: true },

        // Optional message or note from the payer
        message: { type: String, required: true },

        // Amount being paid
        amount: { type: Number, required: true },

        // Whether the payment has been processed/completed
        done: { type: Boolean, default: false }
    },
    {
        // Automatically adds 'createdAt' and 'updatedAt' fields
        timestamps: true
    }
);

// Avoid redefining the model if it already exists (important in Next.js hot reload)
const Payment = mongoose.models.Payment || model("Payment", PaymentSchema);

export default Payment;
