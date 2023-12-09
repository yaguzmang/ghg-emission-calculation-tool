'use client';

import { EmissionsComparerContainer } from './components/emissions-comparer/emissions-comparer-container';
import { ResourcesBanner } from './components/resources-banner';
import { WelcomeBanner } from './components/welcome-banner';

export function HomeContent() {
  return (
    <div className="h-full w-full flex-1 py-8">
      <WelcomeBanner />
      <ResourcesBanner />
      <EmissionsComparerContainer />
      <div className="pb-96" />
    </div>
  );
}
