// app/actions/useractions.js
"use server"

import Stripe from "stripe"
import connectDb from "@/db/connectDb"
import User from "@/models/User"
import Payment from "@/models/Payment"

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function initiateStripe(amount, to_username, paymentform) {
    // Connect to MongoDB
    await connectDb();

    // Validate recipient user
    const user = await User.findOne({name: to_username });
    if (!user) {
        throw new Error("Recipient user not found");
    }

    // Validate inputs
    if (!amount || amount <= 0) { 
        throw new Error("Invalid amount");
    }
    if (!paymentform.name || !paymentform.message) {
        throw new Error("Name and message are required");
    }

    const userStripe = new Stripe(user.stripeSecretKey);

    // Get Stripe Connect account ID (optional)
    const stripe_account_id = user.stripeAccountId;

    // Create PaymentIntent
    const paymentIntent = await userStripe.paymentIntents.create({
        amount: Number.parseInt(amount), // Amount in paise (e.g., 50000 for 500 )
        currency: "pkr", // Rupees
        automatic_payment_methods: { enabled: true }, // Support multiple payment methods
        transfer_data: stripe_account_id ? { destination: stripe_account_id } : undefined, // Stripe Connect
        metadata: {
            to_user: to_username,
            name: paymentform.name,
            message: paymentform.message
        }
    });

    // Save payment to MongoDB
    await Payment.create({
        oid: paymentIntent.id,
        amount: amount / 100, // Convert to INR
        to_user: to_username,
        name: paymentform.name,
        message: paymentform.message
    });

    // Return clientSecret for frontend
    return { clientSecret: paymentIntent.client_secret };
}



export const fetchuser = async (username) => {
    await connectDb();

    const u = await User.findOne({ name: username });

    if (!u) {
        throw new Error(`User with username '${username}' not found`);
    }

    const user = u.toObject({ flattenObjectIds: true });
    return user;
};




export const fetchPaymentsByUsername = async (username) => {
    await connectDb();
    const payments = await Payment.find({ to_user: username })
        .sort({ createdAt: -1 })
        .lean(); // Use lean() to get plain JS objects
    
    // Convert MongoDB specific fields in each payment
    return payments.map(payment => ({
        ...payment,
        _id: payment._id.toString(),
        createdAt: payment.createdAt.toISOString(),
        updatedAt: payment.updatedAt?.toISOString() || null
    }));
};

export const updateProfile = async (data, oldusername) => {
    await connectDb()
    let ndata = Object.fromEntries(data)
    console.log(ndata)
    // If the username is being updated, check if username is available
    if (oldusername !== ndata.name) {
        let u = await User.findOne({ username: ndata.name })
        if (u) {
            return { error: "Username already exists" }
        }   
        await User.updateOne({email: ndata.email}, ndata)
        // Now update all the usernames in the Payments table 
        await Payment.updateMany({to_user: oldusername}, {to_user: ndata.username})
        
    }
    else{

        
        await User.updateOne({email: ndata.email}, ndata)
    }
    
}
