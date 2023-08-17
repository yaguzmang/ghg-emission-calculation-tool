'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useParams, useRouter } from 'next/navigation';

import { FormTabContent } from './form/form-content';
import { ResultsTabContent } from './results/results-content';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function DashboardTabs() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const [selectedTab, setSelectedTab] = useState('form');

  useEffect(() => {
    const hash =
      window.location.hash.length > 0 ? window.location.hash.slice(1) : 'form';
    setSelectedTab(hash);
  }, [params]);

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
              value="form"
              className="relative justify-start rounded-none border-b-[3px] border-b-transparent bg-transparent px-4 py-0 text-2xl font-semibold text-primary shadow-none data-[state=active]:border-b-secondary data-[state=active]:text-secondary data-[state=active]:shadow-none md:min-w-[180px] md:px-0"
            >
              <span className="pb-2 uppercase md:pl-2">
                {t('dashboard.form')}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="relative justify-start rounded-none border-b-[3px] border-b-transparent bg-transparent px-4 py-0 text-2xl font-semibold text-primary shadow-none data-[state=active]:border-b-secondary data-[state=active]:text-secondary data-[state=active]:shadow-none md:min-w-[180px] md:px-0"
            >
              <span className="pb-2 uppercase md:pl-2">
                {t('dashboard.results')}
              </span>
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="flex min-h-[350px] bg-white shadow-strong">
          <TabsContent value="form" className="h-full w-full">
            <FormTabContent />
          </TabsContent>
          <TabsContent value="results" className="h-full w-full">
            <ResultsTabContent />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
