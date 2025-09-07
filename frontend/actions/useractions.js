// app/actions/useractions.js
"use server"

// Import dependencies
import Stripe from "stripe";                 // Stripe SDK for payments
import connectDb from "@/db/connectDb";      // Function to connect to MongoDB
import User from "@/models/User";            // User model
import Payment from "@/models/Payment";      // Payment model

/**
 * Initiates a Stripe payment to a recipient user.
 * @param {number} amount - Payment amount in smallest currency unit (e.g., paisa)
 * @param {string} to_username - Recipient username
 * @param {object} paymentform - Form data containing name and message
 * @returns {object} - Stripe client secret for frontend payment
 */
export async function initiateStripe(amount, to_username, paymentform) {
    // Connect to MongoDB
    await connectDb();

    // Step 1: Validate recipient user
    const user = await User.findOne({ name: to_username });
    if (!user) throw new Error("Recipient user not found");

    // Step 2: Validate payment inputs
    if (!amount || amount <= 0) throw new Error("Invalid amount");
    if (!paymentform.name || !paymentform.message)
        throw new Error("Name and message are required");

    // Step 3: Initialize Stripe with recipient's secret key
    const userStripe = new Stripe(user.stripeSecretKey);

    // Optional: Stripe Connect account ID for transfer
    const stripe_account_id = user.stripeAccountId;

    // Step 4: Create a PaymentIntent (Stripe object to handle payment)
    const paymentIntent = await userStripe.paymentIntents.create({
        amount: Number.parseInt(amount),       // Convert to integer (paisa)
        currency: "pkr",                       // Pakistani Rupee
        automatic_payment_methods: { enabled: true }, // Accept multiple payment methods
        transfer_data: stripe_account_id ? { destination: stripe_account_id } : undefined, // Optional: send to connected account
        metadata: {
            to_user: to_username,              // Save recipient info
            name: paymentform.name,            // Sender name
            message: paymentform.message       // Optional message
        }
    });

    // Step 5: Save payment info in MongoDB
    await Payment.create({
        oid: paymentIntent.id,                 // Stripe PaymentIntent ID
        amount: amount / 100,                  // Convert to rupees for storage
        to_user: to_username,                  // Recipient
        name: paymentform.name,                // Sender name
        message: paymentform.message           // Message
    });

    // Step 6: Return client secret to frontend to complete payment
    return { clientSecret: paymentIntent.client_secret };
}

/**
 * Fetch user by username
 * @param {string} username
 * @returns {object} User object
 */
export const fetchuser = async (username) => {
    await connectDb();

    const u = await User.findOne({ name: username });

    if (!u) throw new Error(`User with username '${username}' not found`);

    // Convert Mongoose document to plain JS object
    return u.toObject({ flattenObjectIds: true });
};

/**
 * Fetch all payments for a specific user
 * @param {string} username
 * @returns {array} List of payments
 */
export const fetchPaymentsByUsername = async (username) => {
    await connectDb();

    const payments = await Payment.find({ to_user: username })
        .sort({ createdAt: -1 }) // Sort by latest first
        .lean();                  // Return plain JS objects

    // Convert MongoDB-specific fields to string/ISO format for easier usage
    return payments.map(payment => ({
        ...payment,
        _id: payment._id.toString(),
        createdAt: payment.createdAt.toISOString(),
        updatedAt: payment.updatedAt?.toISOString() || null
    }));
};

/**
 * Update user profile and optionally update related payments
 * @param {FormData|object} data - Updated user data
 * @param {string} oldusername - Existing username
 */
export const updateProfile = async (data, oldusername) => {
    await connectDb();

    // Convert FormData to plain object if needed
    let ndata = Object.fromEntries(data);
    console.log("Updated data:", ndata);

    // Step 1: Check if username is changing
    if (oldusername !== ndata.name) {
        // Check if new username already exists
        const existingUser = await User.findOne({ username: ndata.name });
        if (existingUser) return { error: "Username already exists" };

        // Update User document
        await User.updateOne({ email: ndata.email }, ndata);

        // Update all related payments to reflect new username
        await Payment.updateMany({ to_user: oldusername }, { to_user: ndata.name });
    } else {
        // No username change, just update user data
        await User.updateOne({ email: ndata.email }, ndata);
    }
};
