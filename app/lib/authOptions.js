// app/lib/authOptions.js
import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google'; // Import Google provider
import dbConnect from './dbConnect';
import { User } from '../../models/User';
import jwt from 'jsonwebtoken';

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your .env file
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user }) {
      try {
        await dbConnect();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          // You can customize the default name for Google users as needed.
          await User.create({
            email: user.email,
            name: user.name || 'Google User',
          });
          // console.log('New user created:', user.email);
        }
        return true;
      } catch (error) {
        console.error('SignIn Callback Error:', error);
        return false;
      }
    },
    async session({ session, token }) {
      await dbConnect();
      const dbUser = await User.findOne({ email: session.user.email });
      if (dbUser) {
        // Generate a JWT token (ensure JWT_SECRET is set in your env)
        const jwtToken = jwt.sign(
          { userId: dbUser._id.toString(), email: dbUser.email },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
        session.token = jwtToken;
        // console.log('Generated JWT:', jwtToken);
      }
      return session;
    },
  },
};
