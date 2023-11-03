'use client';

import React from 'react';

import { DashboardTabs } from './components/tabs/dashboard-tabs';

export default function Dashboard() {
  return (
    <main className="relative mx-2 mt-10 flex justify-center sm:mx-12">
      <div className="w-full">
        <DashboardTabs />
      </div>
    </main>
  );
}
