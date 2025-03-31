import NextAuth from 'next-auth'
import GitHubProvider from "next-auth/providers/github";
import mongoose from 'mongoose';
import User from '@/models/User';

export const authoptions = NextAuth({
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account.provider === "github") {
                try {
                    // ✅ Ensure MongoDB is connected once
                    if (mongoose.connection.readyState === 0) {
                        await mongoose.connect("mongodb://localhost:27017/chai", {
                            useNewUrlParser: true,
                            useUnifiedTopology: true
                        });
                    }

                    // ✅ Get user email from `user.email`
                    const currentUser = await User.findOne({ email: user.email });

                    if (!currentUser) {
                        // ✅ Create a new user
                        const newUser = new User({
                            email: user.email,
                            name: user.name
                        });
                        await newUser.save();
                        user.name = newUser.name; // ✅ Use `name` instead of `username`
                    } else {
                        user.name = currentUser.name; // ✅ Assign name correctly
                    }

                    return true; // Allow sign-in
                } catch (error) {
                    console.error("Sign-in error:", error);
                    return false; // Prevent sign-in on error
                }
            }
            return true;
        }
    }
})

export { authoptions as GET, authoptions as POST }