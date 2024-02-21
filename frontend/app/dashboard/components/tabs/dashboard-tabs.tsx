'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useParams, useRouter } from 'next/navigation';

import { FormTabContent } from './form/form-content';
import { HomeContent } from './home/home-content';
import { ResultsTabContent } from './results/results-content';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserWalkthrough } from '@/components/user-walkthrough/user-walkthrough';
import { useAppDispatch } from '@/redux/store';
import { SharedUIActions } from '@/redux/store/ui/shared';
import { useDashboardTab } from '@/redux/store/ui/shared/hooks';
import {
  DashboardTab,
  UserWalkthroughStep,
} from '@/redux/store/ui/shared/stateType';

export function DashboardTabs() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();

  const [selectedTab, setSelectedTab] = useState<DashboardTab | undefined>(
    undefined,
  );

  const persistedSelectedTab = useDashboardTab();

  useEffect(() => {
    const hash =
      window.location.hash.length > 0
        ? window.location.hash.slice(1)
        : undefined;
    if (hash !== undefined) {
      dispatch(SharedUIActions.setDashboardTab({ tab: hash as DashboardTab }));
      setSelectedTab(hash as DashboardTab);
    }
  }, [dispatch, params]);

  useEffect(() => {
    let hash =
      window.location.hash.length > 0
        ? window.location.hash.slice(1)
        : undefined;
    if (hash === undefined && persistedSelectedTab === undefined) {
      hash = DashboardTab.home;
      router.push(`#${hash}`, { scroll: false });
    } else if (hash === undefined && persistedSelectedTab !== undefined) {
      router.push(`#${persistedSelectedTab}`, { scroll: false });
    }
  });

  const handleTabChange = (tabName: string) => {
    router.push(`#${tabName}`, { scroll: false });
  };

  return (
    <div className="mt-6 w-full max-w-[1328px]">
      <Tabs
        value={selectedTab}
        className="relative mr-auto w-full"
        onValueChange={handleTabChange}
      >
        <div className="flex items-center justify-between">
          <TabsList className="w-full justify-start rounded-none bg-transparent p-0">
            <TabsTrigger
              value={DashboardTab.home}
              className="relative justify-start rounded-none border-b-[3px] border-b-transparent bg-transparent px-4 py-0 text-2xl font-semibold text-primary shadow-none data-[state=active]:border-b-secondary data-[state=active]:text-secondary data-[state=active]:shadow-none md:min-w-[180px] md:px-0"
            >
              <span className="pb-2 uppercase md:pl-2">
                {t('dashboard.home')}
              </span>
            </TabsTrigger>
            <UserWalkthrough
              isButton
              step={UserWalkthroughStep.welcome}
              side="right"
            >
              <TabsTrigger
                value={DashboardTab.inventory}
                className="relative justify-start rounded-none border-b-[3px] border-b-transparent bg-transparent px-4 py-0 text-2xl font-semibold text-primary shadow-none data-[state=active]:border-b-secondary data-[state=active]:text-secondary data-[state=active]:shadow-none md:min-w-[180px] md:px-0"
              >
                <span className="pb-2 uppercase md:pl-2">
                  {t('dashboard.form')}
                </span>
              </TabsTrigger>
            </UserWalkthrough>

            <UserWalkthrough
              isButton
              step={UserWalkthroughStep.resultsPageInformation}
            >
              <TabsTrigger
                value={DashboardTab.results}
                className="relative justify-start rounded-none border-b-[3px] border-b-transparent bg-transparent px-4 py-0 text-2xl font-semibold text-primary shadow-none data-[state=active]:border-b-secondary data-[state=active]:text-secondary data-[state=active]:shadow-none md:min-w-[180px] md:px-0"
              >
                <span className="pb-2 uppercase md:pl-2">
                  {t('dashboard.results')}
                </span>
              </TabsTrigger>
            </UserWalkthrough>
          </TabsList>
        </div>
        <div className="flex min-h-[350px] bg-white shadow-strong">
          <TabsContent value={DashboardTab.home} className="h-full w-full">
            <HomeContent />
          </TabsContent>
          <TabsContent value={DashboardTab.inventory} className="h-full w-full">
            <FormTabContent />
          </TabsContent>
          <TabsContent value={DashboardTab.results} className="h-full w-full">
            <ResultsTabContent />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
