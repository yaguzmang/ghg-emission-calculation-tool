'use client';

import React from 'react';

import {
  Arrow,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { signIn, signOut, useSession } from 'next-auth/react';

import { Icons } from './ui/icons/icons';

export function UserNavInfo() {
  const { data: session } = useSession();

  return (
    <>
      <div className="flex-col">
        {session?.user?.username && (
          <>
            <p className="text-xs font-bold">{session.user.username}</p>
            <p className="text-xs font-bold">XXXX</p>
          </>
        )}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className="ml-2">
            <Icons.UserAvatar className="h-8 w-8" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="z-50 mr-2 w-64 rounded-none bg-gray-lighten p-4 text-popover-foreground shadow-strong outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
          {session?.user?.username ? (
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              Sign Out
            </button>
          ) : (
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => signIn('Log in', { callbackUrl: '/dashboard' })}
            >
              Sign In
            </button>
          )}
          <Arrow className="fill-gray-lighten" />
        </PopoverContent>
      </Popover>
    </>
  );
}
