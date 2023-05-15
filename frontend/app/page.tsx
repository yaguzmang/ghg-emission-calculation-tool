'use client';

import React from 'react';

import { signIn, signOut, useSession } from 'next-auth/react';

import { useGetUserQuery } from '@/features/user/userSlice';

export default function LandingPage() {
  const { data: session } = useSession();
  const userData = useGetUserQuery();

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
            onClick={() => signIn()}
          >
            Sign In
          </button>
        )}

        {userData && userData.currentData ? (
          <div>
            <h3>User data</h3>
            <p>{JSON.stringify(userData.currentData)}</p>
          </div>
        ) : null}
      </div>
    </main>
  );
}
