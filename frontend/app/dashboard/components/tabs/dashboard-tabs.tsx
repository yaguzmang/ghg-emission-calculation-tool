'use client';

import { useTranslation } from 'react-i18next';

import { FormTabContent } from './form/form-content';

import { Loader } from '@/components/ui/loader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export function DashboardTabs() {
  const { t } = useTranslation();
  return (
    <div className="mt-6">
      <Tabs defaultValue="xxxx" className="relative mr-auto w-full">
        <div className="flex items-center justify-between">
          <TabsList className="w-full justify-start rounded-none bg-transparent p-0">
            <TabsTrigger
              value="xxxx"
              className="relative justify-start rounded-none border-b-[3px] border-b-transparent bg-transparent px-4 py-0 text-2xl font-semibold text-primary shadow-none data-[state=active]:border-b-secondary data-[state=active]:text-secondary data-[state=active]:shadow-none md:min-w-[180px] md:px-0"
            >
              <span className="pb-2 uppercase md:pl-2">XXXX</span>
            </TabsTrigger>
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
        <div className={cn('flex min-h-[350px] bg-white shadow-strong')}>
          <TabsContent value="xxxx" className="h-full w-full">
            <Loader />
          </TabsContent>
          <TabsContent value="form" className="h-full w-full">
            <FormTabContent />
          </TabsContent>
          <TabsContent value="results" className="h-full w-full">
            <div className="flex flex-col space-y-4">
              {t('dashboard.results')}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
