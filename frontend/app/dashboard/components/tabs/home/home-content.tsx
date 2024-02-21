'use client';

import { EmissionsComparerContainer } from './components/emissions-comparer/emissions-comparer-container';
import { WelcomeBanner } from './components/welcome-banner';

export function HomeContent() {
  return (
    <div className="h-full w-full flex-1 py-8">
      <WelcomeBanner />
      {/* <ResourcesBanner /> */}
      <div className="pb-20" />

      <EmissionsComparerContainer />
      <div className="pb-96" />
    </div>
  );
}
