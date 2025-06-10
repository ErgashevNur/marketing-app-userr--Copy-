import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log(user, account, profile, email, credentials, "20qator");

      console.log("User signed in:", user);
      return true;
    },
    async signOut({ token }) {
      console.log("User signed out:", token);
    },
    async error({ error }) {
      console.error("NextAuth Error:", error);
    },
  },
});

export { handler as GET, handler as POST };
