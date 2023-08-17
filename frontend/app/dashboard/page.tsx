'use client';

import React from 'react';

import { DashboardTabs } from './components/tabs/dashboard-tabs';

export default function Dashboard() {
  return (
    <main className="relative mx-2 mt-10 sm:mx-12 flex justify-center">
      <div className="w-full">
        <DashboardTabs />
      </div>
    </main>
  );
}
