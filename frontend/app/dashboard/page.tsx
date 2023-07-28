'use client';

import React from 'react';

import { DashboardTabs } from './components/tabs/dashboard-tabs';

import { Skeleton } from '@/components/ui/skeleton';
import { useGetGeneralSettingsByLocaleQuery } from '@/redux/api/settings/generalSettingsApiSlice';
import { useSelectedLocale } from '@/redux/store/ui/shared';

export default function Dashboard() {
  const selectedLocale = useSelectedLocale();

  const generalSettings = useGetGeneralSettingsByLocaleQuery(
    selectedLocale ?? (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as string),
  );

  const appName = generalSettings?.currentData?.data?.attributes?.appName;

  return (
    <main className="relative mt-10 mx-12">
      <div>
        <div>
          <span>XXXX</span>
          <span className="px-2 text-secondary">/</span>
          <span className="text-secondary">
            {appName || <Skeleton className="inline-block h-3 w-[50px]" />}
          </span>
        </div>
        <h1 className="mt-3 text-3xl">
          {appName || <Skeleton className="inline-block h-6 w-36" />}
        </h1>
        <DashboardTabs />
      </div>
    </main>
  );
}
