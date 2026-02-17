import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/db";
import { User } from "@/lib/models";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            httpOptions: {
                timeout: 40000,
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
                if (!user.email || !adminEmails.includes(user.email)) {
                    return false; // Reject unauthorized users
                }

                await dbConnect();
                try {
                    const existingUser = await User.findOne({ email: user.email });

                    if (!existingUser) {
                        await User.create({
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            role: "ADMIN",
                            lastLogin: new Date(),
                        });
                    } else {
                        // Update last login
                        existingUser.lastLogin = new Date();
                        await existingUser.save();
                    }
                    return true;
                } catch (error) {
                    console.error("Error saving user to DB:", error);
                    return false;
                }
            }
            return false; // Only Google allowed
        },
        async session({ session, token }) {
            // Add custom properties to session here if needed
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = "ADMIN";
            }
            return token;
        }
    },
    pages: {
        signIn: "/login",
        error: "/login", // Redirect to login page on error
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
};
