import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "./db";
import AdminUser from "@/models/AdminUser";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.warn("[Auth] Credentials missing email or password");
            return null;
          }

          await dbConnect();

          const email = (credentials.email as string).toLowerCase().trim();
          const rawPassword = (credentials.password as string).trim();

          const user = await AdminUser.findOne({ email });

          if (!user) {
            console.warn(`[Auth] No admin user found for email: "${email}"`);
            return null;
          }

          const isPasswordCorrect = await bcrypt.compare(
            rawPassword,
            user.passwordHash
          );

          if (!isPasswordCorrect) {
            console.warn(`[Auth] Password mismatch for email: "${email}"`);
            return null;
          }

          console.log(`[Auth] Successful login for: "${email}"`);
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("[Auth] Exception during authorize callback:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
});
