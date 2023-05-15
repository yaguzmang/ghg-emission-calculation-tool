'use client';

import React from 'react';

import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function LandingPage() {
  const { data: session } = useSession();

  return (
    <main>
      <h1 className="bg-green-500 text-2xl underline">LANDING PAGE</h1>
      <div>
        {session?.user ? (
          <>
            <p className="text-sky-600"> {session?.user?.username}</p>
            <button
              type="button"
              className="text-red-500"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            type="button"
            className="text-green-600"
            onClick={() => signIn('Log in', { callbackUrl: '/dashboard' })}
          >
            Sign In
          </button>
        )}
      </div>
      <Link href="/dashboard">Go to dashboard</Link>
    </main>
  );
}
