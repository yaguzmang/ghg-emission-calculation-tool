import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Log in',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      // async authorize(credentials, req) { To uncomment when setting up the login.
      async authorize() {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/local`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              identifier: 'user1@example.com',
              password: 'user1pw',
            }),
          }
        );
        const user = await res.json();
        if (user) {
          return { jwt: user.jwt, ...user.user };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      return { ...session, user: token };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
