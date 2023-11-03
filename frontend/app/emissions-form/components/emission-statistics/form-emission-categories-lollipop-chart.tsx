'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  LollipopChart,
  LollipopEntry,
} from '@/components/charts/lollipop-chart';
import { kgsToTons } from '@/lib/numbers.ts/conversion';
import { calculateTotalEmissionsOfEmissionCategory } from '@/lib/statistics/utils';
import { useGetEmissionCategoriesWithEmissionsQuery } from '@/redux/api/emission-categories/emissionCategoriesApiSlice';

type FormEmissionCategoriesLollipopChartProps = {
  emissionCategoryId: number;
  reportingPeriodId: number;
  locale: string;
};

export function FormEmissionCategoriesLollipopChart({
  emissionCategoryId,
  reportingPeriodId,
  locale,
}: FormEmissionCategoriesLollipopChartProps) {
  const { t } = useTranslation();

  const emissionCategoriesWithEmissions =
    useGetEmissionCategoriesWithEmissionsQuery(
      {
        locale,
        reportingPeriodId,
      },
      {
        skip: locale === undefined || reportingPeriodId === undefined,
      },
    );

  const [emissionCategoryLollipopEntries, categoryTitle] = useMemo<
    [LollipopEntry[], string]
  >(() => {
    const entriesArray: LollipopEntry[] = [] as LollipopEntry[];
    let foundCategoryTittle = '';
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

          if (emissionCategoryId === emissionCategoryWithEmissions.id) {
            foundCategoryTittle = categoryTitle;
            entriesArray.unshift({
              label: categoryTitle,
              value: kgsToTons(categoryTotalGHGEmissions),
              color: categoryColor,
            });
          } else {
            entriesArray.push({
              label: categoryTitle,
              value: kgsToTons(categoryTotalGHGEmissions),
              color: categoryColor,
            });
          }
        },
      );
    }
    return [entriesArray, foundCategoryTittle];
  }, [emissionCategoriesWithEmissions.currentData, emissionCategoryId]);

  return (
    <div className="flex h-full min-h-[300px] w-full flex-col gap-6">
      <span className="text-lg font-bold">
        {t('dashboard.form.emissionSummary.allCategoryEmissionsInComparison', {
          categoryTitle,
        })}
      </span>
      <LollipopChart
        unitLabel={t('dashboard.form.emissionsSummary.tCO2e')}
        data={emissionCategoryLollipopEntries}
        heightSizeType="fit-content"
        sort={false}
      />
    </div>
  );
}
