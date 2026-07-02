import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
import connectDb from "./lib/connectDb";
import User from "./models/user.model";


export const { handlers  , auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectDb();
          const email = credentials.email as string;
          const password = credentials.password as string;
          const user = await User.findOne({ email });
          if (!user) {
            throw new Error("No user found with this email");
          }
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            throw new Error("Invalid password");
          }
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (err) {
          console.error("Error in authorize function:", err);
          return null;
        }
      },
    }),

  ],

  callbacks: {
    jwt({ token, user }: any) {
      if (user) {
        token.id = user.id?.toString();
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },

    session({ session, token }: any) {
      if (!session.user) {
        session.user = {} as any;
      }
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.role = token.role as string;
      return session;
    },

  
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET,
});