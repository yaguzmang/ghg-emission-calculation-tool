import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Log in',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, _req) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/auth/local`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              identifier: credentials?.email,
              password: credentials?.password,
            }),
          },
        );
        if (res.status !== 200) return null;
        const user = await res.json();
        if (user && user.jwt && user.user) {
          return { jwt: user.jwt, ...user.user };
        }
        throw new Error('Something went wrong while logging in.');
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
