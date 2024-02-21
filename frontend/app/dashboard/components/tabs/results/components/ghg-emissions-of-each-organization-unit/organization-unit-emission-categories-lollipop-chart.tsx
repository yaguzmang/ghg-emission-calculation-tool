'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  LollipopChart,
  LollipopEntry,
} from '@/components/charts/lollipop-chart';
import { calculateTotalAllEmissionPerCategory } from '@/lib/data/organizations-utils';
import { kgsToTons } from '@/lib/numbers.ts/conversion';
import { EmissionCategoryTotalByEmissionType } from '@/types/emission-result';

type EmissionCategoriesLollipopChartProps = {
  emissionsDataArray: EmissionCategoryTotalByEmissionType[][];
  heightSizeType: 'container' | 'fit-content';
};

export function OrganizationUnitEmissionCategoriesLollipopChart({
  emissionsDataArray,
  heightSizeType,
}: EmissionCategoriesLollipopChartProps) {
  const { t } = useTranslation();
  const organizationUnitEmissionCategoryLollipopEntries = useMemo<
    LollipopEntry[]
  >(() => {
    const entriesArray: LollipopEntry[] = [] as LollipopEntry[];
    if (emissionsDataArray) {
      const totalEmissionsPerCategory =
        calculateTotalAllEmissionPerCategory(emissionsDataArray);
      totalEmissionsPerCategory.forEach((emissionCategory) => {
        entriesArray.push({
          label: emissionCategory.title,
          value: kgsToTons(emissionCategory.totalEmissions),
          color: emissionCategory.color ?? null,
        });
      });
    }
    return entriesArray;
  }, [emissionsDataArray]);

  return (
    <div className="flex h-full min-h-[300px] w-full flex-col">
      <LollipopChart
        unitLabel={t('dashboard.form.emissionsSummary.tCO2e')}
        data={organizationUnitEmissionCategoryLollipopEntries}
        heightSizeType={heightSizeType}
      />
    </div>
  );
}
