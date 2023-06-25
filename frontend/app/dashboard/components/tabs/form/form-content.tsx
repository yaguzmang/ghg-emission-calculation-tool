'use client';

import { nanoid } from 'nanoid';

import { OrganizationPeriodForm } from '../../organization-period-form/organization-period-form';
import { EmissionCategoryCard } from './components/emission-category-card';
import { EmissionsSummary } from './components/emissions-summary';

import { Skeleton } from '@/components/ui/skeleton';
import { useGetDashboardEmissionCategoriesByLocaleQuery } from '@/redux/api/settings/dashboardSettingsApiSlice';
import { useSelectedLocale } from '@/redux/store/ui/shared';

export function FormTabContent() {
  const selectedLocale = useSelectedLocale();
  const {
    data: dashboardEmissionCategories,
    isLoading: isEmissionCategoriesLoading,
    isFetching: isEmissionCategoriesFetching,
  } = useGetDashboardEmissionCategoriesByLocaleQuery(
    selectedLocale ?? (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as string)
  );

  return (
    <div className="h-full w-full flex-1 p-8">
      <div className="flex flex-wrap justify-between gap-8 ">
        <OrganizationPeriodForm section="form" />
        <EmissionsSummary />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 md:mt-16">
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
