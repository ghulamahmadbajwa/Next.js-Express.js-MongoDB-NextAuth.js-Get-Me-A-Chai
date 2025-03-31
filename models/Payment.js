import mongoose from "mongoose";

const { Schema, model } = mongoose;

const PaymentSchema = new Schema(
    {
        name: { type: String, required: true },
        to_user: { type: String, required: true },
        oid: { type: String, required: true },
        message: { type: String, required: true },
        amount: { type: Number, required: true },
        done: { type: Boolean, default: false }
    },
    { timestamps: true } // Automatically manages createdAt & updatedAt
);

// Check if the model already exists before defining it
const Payment = mongoose.models.Payment || model("Payment", PaymentSchema);

export default Payment;
