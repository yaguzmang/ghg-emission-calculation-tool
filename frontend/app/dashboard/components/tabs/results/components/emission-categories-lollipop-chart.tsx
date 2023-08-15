'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  LollipopChart,
  LollipopEntry,
} from '@/components/charts/lollipop-chart';
import { calculateTotalEmissionsOfEmissionCategory } from '@/lib/statistics/utils';
import { useGetEmissionCategoriesWithEmissionsQuery } from '@/redux/api/emission-categories/emissionCategoriesApiSlice';
import {
  useSelectedLocale,
  useSelectedReportingPeriodId,
} from '@/redux/store/ui/shared';

type EmissionCategoriesLollipopChartProps = {
  heightSizeType: 'container' | 'fit-content';
};

export function EmissionCategoriesLollipopChart({
  heightSizeType,
}: EmissionCategoriesLollipopChartProps) {
  const { t } = useTranslation();
  const selectedLocale = useSelectedLocale();
  const selectedReportingPeriodId = useSelectedReportingPeriodId('results');

  const emissionCategoriesWithEmissions =
    useGetEmissionCategoriesWithEmissionsQuery(
      {
        locale: selectedLocale ?? '',
        reportingPeriodId: selectedReportingPeriodId ?? 0,
      },
      {
        skip:
          selectedLocale === undefined ||
          selectedReportingPeriodId === undefined,
      },
    );

  const emissionCategoryLollipopEntries = useMemo<LollipopEntry[]>(() => {
    const entriesArray: LollipopEntry[] = [] as LollipopEntry[];
    if (emissionCategoriesWithEmissions.currentData) {
      emissionCategoriesWithEmissions.currentData.forEach(
        (emissionCategoryWithEmissions) => {
          const categoryTotalGHGEmissions =
            emissionCategoryWithEmissions !== undefined
              ? calculateTotalEmissionsOfEmissionCategory(
                  emissionCategoryWithEmissions,
                  false,
                )
              : 0;
          if (categoryTotalGHGEmissions === 0) return;
          const categoryColor = emissionCategoryWithEmissions.color ?? null;
          const categoryTitle = emissionCategoryWithEmissions.title;

          entriesArray.push({
            label: categoryTitle,
            value: categoryTotalGHGEmissions,
            color: categoryColor,
          });
        },
      );
    }
    return entriesArray;
  }, [emissionCategoriesWithEmissions.currentData]);

  return (
    <div className="w-full h-full min-h-[300px] flex flex-col">
      <LollipopChart
        unitLabel={t('dashboard.form.emissionsSummary.tCO2e')}
        data={emissionCategoryLollipopEntries}
        heightSizeType={heightSizeType}
      />
    </div>
  );
}
