import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import { User } from "@/lib/models";

const ALLOWED_USERS = [
    { name: "Sanjay Dalbanjan", mobile: "9106694070" },
    { name: "Rushil Dalbanjan", mobile: "7383508095" }
];

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Mobile Login",
            credentials: {
                mobile: { label: "Mobile Number", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.mobile || !credentials?.password) {
                    return null;
                }

                // 1. Validate Credentials (Password == Mobile)
                if (credentials.password !== credentials.mobile) {
                    return null;
                }

                // 2. Check if user is in allowed list
                const allowedUser = ALLOWED_USERS.find(u => u.mobile === credentials.mobile);

                if (!allowedUser) {
                    return null;
                }

                await dbConnect();

                try {
                    // 3. User Persistence (Find or Create in MongoDB)
                    let user = await User.findOne({ mobile: credentials.mobile });

                    if (!user) {
                        user = await User.create({
                            name: allowedUser.name,
                            mobile: allowedUser.mobile,
                            role: "ADMIN",
                            lastLogin: new Date(),
                        });
                    } else {
                        // Update last login
                        user.lastLogin = new Date();
                        await user.save();
                    }

                    // Return user object for session
                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.mobile, // Storing mobile in email field for compatibility if needed, or just relying on generic id/name
                        image: null
                    };

                } catch (error) {
                    console.error("Auth Error:", error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                // Ensure properties are available
                session.user.name = token.name;
                // We can put mobile in email to keep it accessible if needed
                session.user.email = token.email;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = "ADMIN";
                token.name = user.name;
                token.email = user.email; // This is actually the mobile number from authorize
            }
            return token;
        }
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
};
