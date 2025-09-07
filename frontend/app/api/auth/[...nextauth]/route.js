import NextAuth from 'next-auth';
import GitHubProvider from "next-auth/providers/github";
import mongoose from 'mongoose';
import User from '@/models/User';
import Payment from '@/models/Payment';

/**
 * NextAuth configuration object
 */
export const authoptions = NextAuth({
    // -------------------------------
    // Authentication providers
    // -------------------------------
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,      // GitHub OAuth client ID
            clientSecret: process.env.GITHUB_SECRET // GitHub OAuth client secret
        })
    ],

    // -------------------------------
    // Callbacks
    // -------------------------------
    callbacks: {
        /**
         * signIn callback is triggered whenever a user attempts to sign in.
         * Here, we check if the user exists in MongoDB. If not, we create a new user.
         */
        async signIn({ user, account }) {
            if (account.provider === "github") { // Only handle GitHub provider
                try {
                    // -------------------------------
                    // Ensure MongoDB connection
                    // -------------------------------
                    if (mongoose.connection.readyState === 0) {
                        await mongoose.connect("mongodb://localhost:27017/chai", {
                            useNewUrlParser: true,
                            useUnifiedTopology: true
                        });
                    }

                    // -------------------------------
                    // Check if user exists
                    // -------------------------------
                    const currentUser = await User.findOne({ email: user.email });

                    if (!currentUser) {
                        // -------------------------------
                        // User does not exist, create new one
                        // -------------------------------
                        const newUser = new User({
                            email: user.email,          // GitHub email
                            name: user.name,            // GitHub name
                            profilepic: user.image      // GitHub avatar
                        });

                        await newUser.save();

                        // Update `user` object returned to NextAuth
                        user.name = newUser.name; // Used in session
                    } else {
                        // -------------------------------
                        // User exists, update `user` object
                        // -------------------------------
                        user.name = currentUser.name;
                    }

                    return true; // ✅ Allow sign-in
                } catch (error) {
                    console.error("Sign-in error:", error);
                    return false; // ❌ Prevent sign-in if something goes wrong
                }
            }

            // Allow sign-in for other providers if any
            return true;
        }
    },
});

// Export NextAuth endpoints
export { authoptions as GET, authoptions as POST };
