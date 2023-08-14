import { Trans, useTranslation } from 'react-i18next';

import { Skeleton } from '@/components/ui/skeleton';
import { getEmissionCategoryEntries } from '@/lib/data/utils';
import {
  calculateCategoryTotalBiogenicEmissions,
  calculateCategoryTotalGHGEmissions,
  calculateEmissionEntryTotalBiogenicEmissions,
  calculateEmissionEntryTotalGHGEmissions,
} from '@/lib/statistics/utils';
import { cn } from '@/lib/utils';
import {
  useGetEmissionCategoriesWithFactorsQuery,
  useGetEmissionCategoryWithLocalizationsQuery,
} from '@/redux/api/emission-categories/emissionCategoriesApiSlice';
import { useGetEmissionEntriesByReportingPeriodQuery } from '@/redux/api/emission-entries/emissionEntriesApiSlice';

interface AllCategoryEmissionsSummaryProps {
  emissionCategoryId: number;
  reportingPeriodId: number;
  locale: string;
}

export default function AllCategoryEmissionsSummary({
  emissionCategoryId,
  reportingPeriodId,
  locale,
}: AllCategoryEmissionsSummaryProps) {
  const { t } = useTranslation();

  const emissionCategoryWithFactors = useGetEmissionCategoriesWithFactorsQuery(
    {
      emissionCategoryId: emissionCategoryId ?? -1,
      reportingPeriodId: reportingPeriodId ?? -1,
    },
    {
      skip: emissionCategoryId === undefined || reportingPeriodId === undefined,
    },
  );

  const emissionEntries =
    useGetEmissionEntriesByReportingPeriodQuery(reportingPeriodId);
  const emissionCategoryWithLocalizations =
    useGetEmissionCategoryWithLocalizationsQuery(emissionCategoryId, {
      skip: locale === (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as string),
    });

  let originalEmissionCategoryId: null | number = null;
  if (
    locale.toLocaleLowerCase() !==
      (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as string) &&
    emissionCategoryWithLocalizations.currentData
  ) {
    originalEmissionCategoryId =
      emissionCategoryWithLocalizations.currentData?.attributes.localizations.data.find(
        (emissionCategory) =>
          emissionCategory.attributes.locale ===
          (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as string),
      )?.id ?? null;
  }
  const emissionSources =
    emissionCategoryWithFactors.currentData?.emissionSourceGroups.flatMap(
      (emissionSourceGroup) => emissionSourceGroup.emissionSources,
    );

  const emissionEntriesOfCategory = getEmissionCategoryEntries(
    emissionEntries.currentData,
    originalEmissionCategoryId !== null
      ? originalEmissionCategoryId
      : emissionCategoryId,
  );

  const totalGHGEmissions =
    emissionEntriesOfCategory !== null && emissionSources
      ? calculateCategoryTotalGHGEmissions(
          emissionEntriesOfCategory,
          emissionSources,
        )
      : 0;

  const totalBiogenicEmissions =
    emissionEntriesOfCategory !== null && emissionSources
      ? calculateCategoryTotalBiogenicEmissions(
          emissionEntriesOfCategory,
          emissionSources,
        )
      : 0;
  return (
    <>
      <span className="text-lg text-text-regular">
        {t('dashboard.form.emissionSummary.GHGEmissions')}
      </span>
      <span className="text-lg text-text-regular ml-auto">
        <Trans i18nKey="dashboard.form.emissionsSummary.tCO2e" />
      </span>
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between border-b-ring border-b pb-2 mb-4">
          {emissionCategoryWithFactors.isLoading ? (
            <Skeleton className="inline-block h-7 w-64" />
          ) : (
            <h4>
              {t('dashboard.form.emissionSummary.allCategoryGHGEmissions', {
                categoryTitle: emissionCategoryWithFactors.currentData?.title,
              })}
            </h4>
          )}

          <span
            className={cn('text-2xl leading-7 font-bold', {
              'text-primary-disabled-foreground': totalGHGEmissions === 0,
            })}
          >
            {totalGHGEmissions.toFixed(2)}
          </span>
        </div>

        {emissionEntriesOfCategory?.map((emissionEntry) => {
          const emissionEntrySourceId =
            emissionEntry.attributes.emissionSource.data.id;

          const emissionSource = emissionSources?.find(
            (emissionSource) => emissionSource.id === emissionEntrySourceId,
          );

          let totalEntryEmissions = 0;
          if (emissionSource)
            totalEntryEmissions = calculateEmissionEntryTotalGHGEmissions(
              emissionEntry,
              emissionSource,
            );

          return (
            <div
              key={`${'emissionEntryTotalGHG'}-${emissionEntry.id}`}
              className="flex items-center justify-between text-text-regular text-lg"
            >
              <span>{`${emissionSource?.label} (${emissionSource?.unit})`}</span>
              <span>{totalEntryEmissions.toFixed(2)}</span>
            </div>
          );
        })}

        <div className="flex items-center justify-between border-b-ring border-b pb-2 mb-4 mt-16">
          <h4>{t('dashboard.form.emissionSummary.allBiogenicEmissions')}</h4>
          <span
            className={cn('text-2xl leading-7 font-bold', {
              'text-primary-disabled-foreground': totalBiogenicEmissions === 0,
            })}
          >
            {totalBiogenicEmissions.toFixed(2)}
          </span>
        </div>

        {emissionEntriesOfCategory?.map((emissionEntry) => {
          const emissionEntrySourceId =
            emissionEntry.attributes.emissionSource.data.id;

          const emissionSource = emissionSources?.find(
            (emissionSource) => emissionSource.id === emissionEntrySourceId,
          );

          let totalEntryEmissions = 0;
          if (emissionSource)
            totalEntryEmissions = calculateEmissionEntryTotalBiogenicEmissions(
              emissionEntry,
              emissionSource,
            );

          return (
            totalEntryEmissions > 0 && (
              <div
                key={`${'emissionEntryTotalBiogenic'}-${emissionEntry.id}`}
                className="flex items-center justify-between text-text-regular text-lg"
              >
                <span>{`${emissionSource?.label} (${emissionSource?.unit})`}</span>
                <span>{totalEntryEmissions.toFixed(2)}</span>
              </div>
            )
          );
        })}
      </div>
    </>
  );
}
