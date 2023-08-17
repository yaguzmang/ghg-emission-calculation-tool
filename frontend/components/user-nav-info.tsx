'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Arrow,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import { signIn, signOut, useSession } from 'next-auth/react';

import { Icons } from './ui/icons/icons';
import { Skeleton } from './ui/skeleton';

import { useGetUserQuery } from '@/redux/api/user/userApiSlice';

export function UserNavInfo() {
  const { data: sessionData, status: sessionStatus } = useSession();
  const userData = useGetUserQuery(undefined, {
    skip: sessionData?.user === undefined,
  });

  const isLoading = sessionStatus === 'loading' || userData.isFetching;

  const { t } = useTranslation();

  return (
    <>
      <div className="flex-col">
        {isLoading && <Skeleton className="inline-block h-8 w-10" />}
        {!isLoading && sessionStatus === 'authenticated' && (
          <p className="text-xs font-bold">
              {userData?.currentData?.username}
            </p>
        )}
        {!isLoading && sessionStatus === 'unauthenticated' && (
          <button
            type="button"
            className="hover:underline"
            onClick={() => signIn('Log in', { callbackUrl: '/dashboard' })}
          >
            <p className="text-xs font-bold">{t('login')}</p>
          </button>
        )}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <button type="button" className="ml-2">
            <Icons.UserAvatar className="h-8 w-8" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="z-50 mr-2 w-64 rounded-none bg-gray-lighten p-4 text-popover-foreground shadow-strong outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
          {sessionData?.user !== undefined ? (
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              {t('signout')}
            </button>
          ) : (
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => signIn('Log in', { callbackUrl: '/dashboard' })}
            >
              {t('login')}
            </button>
          )}
          <Arrow className="fill-gray-lighten" />
        </PopoverContent>
      </Popover>
    </>
  );
}
