'use client';

import { nanoid } from 'nanoid';

import { EmissionCategoryCard } from './components/emission-category-card';

import { EmissionsSummaryPanel } from '@/components/emissions-summary-panel/emissions-summary-panel';
import { OrganizationPeriodForm } from '@/components/organization-period-form/organization-period-form';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetDashboardEmissionCategoriesByLocaleQuery } from '@/redux/api/settings/dashboardSettingsApiSlice';
import {
  useSelectedLocale,
  useSelectedReportingPeriodId,
} from '@/redux/store/ui/shared';

export function FormTabContent() {
  const selectedLocale = useSelectedLocale();
  const selectedeportingPeriodId = useSelectedReportingPeriodId('form');

  const {
    data: dashboardEmissionCategories,
    isLoading: isEmissionCategoriesLoading,
    isFetching: isEmissionCategoriesFetching,
  } = useGetDashboardEmissionCategoriesByLocaleQuery(
    selectedLocale ?? (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as string),
  );

  return (
    <div className="h-full w-full flex-1 py-8 px-2 sm:px-8">
      <div className="flex flex-wrap justify-between gap-8 ">
        <OrganizationPeriodForm section="form" />
        <EmissionsSummaryPanel
          reportingPeriodId={selectedeportingPeriodId}
          locale={selectedLocale}
          includeAccuracy={false}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-4">
        {dashboardEmissionCategories === undefined ||
        isEmissionCategoriesLoading ||
        isEmissionCategoriesFetching
          ? Array(18)
              .fill(null)
              .map(() => (
                <Skeleton
                  key={nanoid()}
                  className="inline-block h-[136px] w-[400px]"
                />
              ))
          : dashboardEmissionCategories?.map((emissionCategory) => (
              <EmissionCategoryCard
                key={emissionCategory.id}
                emissionCategory={emissionCategory}
              />
            ))}
      </div>
    </div>
  );
}
