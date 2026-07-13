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
    Google({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
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

    async signIn({ user, account }: any) {
      if (account?.provider === "google") {
        try {
          await connectDb();
          let existUser = await User.findOne({ email: user.email });
          if (!existUser) {
            existUser = new User({
              name: user.name,
              email: user.email,
              image: user.image,
             
            });
            await existUser.save();
          }
          user.id = existUser._id.toString();
          user.role = existUser.role.toString();
     
        } catch (err) {
          console.error("Error in Google sign-in callback:", err);
      
        }
      }
    return true;
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