/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth'; // Necessary for the module to work correctly

declare module 'next-auth' {
  type Session = {
    user: {
      id: number;
      username: string;
      email: string;
      provider: string;
      confirmed: boolean;
      blocked: boolean;
      jwt: string;
    };
  };
}
