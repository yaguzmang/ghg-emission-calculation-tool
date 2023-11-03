'use client';

import { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import {
  StackedSideBarPercentageChartWithTotal,
  StackedSideBarPercentageChartWithTotalEntry,
  StackedSideBarPercentageChartWithTotalEntryData,
} from '../charts/stacked-side-bar-percentage-chart-with-total';

import { kgsToTons } from '@/lib/numbers.ts/conversion';
import { EmissionCategoryFlattenWithEmissions } from '@/types/emission-category';

interface EmissionsSummaryGraphProps {
  emissionCategoriesWithEmissions: EmissionCategoryFlattenWithEmissions[];
}

export function EmissionsSummaryGraph({
  emissionCategoriesWithEmissions,
}: EmissionsSummaryGraphProps) {
  const { t } = useTranslation();

  const [stackedSideBarPercentageChartWithTotalEntries, totalEmissions] =
    useMemo<[StackedSideBarPercentageChartWithTotalEntry[], number]>(() => {
      if (emissionCategoriesWithEmissions === undefined) return [[], 0];
      let totalActivityEmissions = 0;
      let totalUpstreamEmissions = 0;
      let totalBiogenicEmissions = 0;
      let totalEmissions = 0;

      const stackedSideBarPercentageEntries: StackedSideBarPercentageChartWithTotalEntry[] =
        [];

      emissionCategoriesWithEmissions.forEach((categoryWithEmissions) => {
        const categoryTotalEmissions =
          categoryWithEmissions.emissions.direct +
          categoryWithEmissions.emissions.indirect +
          categoryWithEmissions.emissions.biogenic;
        if (categoryTotalEmissions === 0) return;
        totalActivityEmissions += categoryWithEmissions.emissions.direct;
        totalUpstreamEmissions += categoryWithEmissions.emissions.indirect;
        totalBiogenicEmissions += categoryWithEmissions.emissions.biogenic;

        const entryData: StackedSideBarPercentageChartWithTotalEntryData[] = [];

        const activityEntry: StackedSideBarPercentageChartWithTotalEntryData = {
          label: t('dashboard.form.allGHGEmissions.activityEmission'),
          color: '#414546',
          value: kgsToTons(categoryWithEmissions.emissions.direct),
        };
        entryData.push(activityEntry);

        const upstreamEntry: StackedSideBarPercentageChartWithTotalEntryData = {
          label: t('dashboard.form.allGHGEmissions.upstreamEmission'),
          color: '#8A8A8A',
          value: kgsToTons(categoryWithEmissions.emissions.indirect),
        };
        entryData.push(upstreamEntry);

        const biogenicEntry: StackedSideBarPercentageChartWithTotalEntryData = {
          label: t('dashboard.form.allGHGEmissions.biogenicEmission'),
          color: '#1A1A1A',
          value: kgsToTons(categoryWithEmissions.emissions.biogenic),
        };
        entryData.push(biogenicEntry);

        stackedSideBarPercentageEntries.push({
          title: categoryWithEmissions.title,
          data: entryData,
        });
      });

      const totalEntryData: StackedSideBarPercentageChartWithTotalEntryData[] =
        [];

      const totalActivityEntry: StackedSideBarPercentageChartWithTotalEntryData =
        {
          label: t('dashboard.form.allGHGEmissions.activityEmission'),
          color: '#414546',
          value: kgsToTons(totalActivityEmissions),
        };
      totalEntryData.push(totalActivityEntry);

      const totalUpstreamEntry: StackedSideBarPercentageChartWithTotalEntryData =
        {
          label: t('dashboard.form.allGHGEmissions.upstreamEmission'),
          color: '#8A8A8A',
          value: kgsToTons(totalUpstreamEmissions),
        };
      totalEntryData.push(totalUpstreamEntry);

      const totalBiogenicEntry: StackedSideBarPercentageChartWithTotalEntryData =
        {
          label: t('dashboard.form.allGHGEmissions.biogenicEmission'),
          color: '#1A1A1A',
          value: kgsToTons(totalBiogenicEmissions),
        };
      totalEntryData.push(totalBiogenicEntry);

      stackedSideBarPercentageEntries.unshift({
        title: t('dashboard.form.allGHGEmissions.total'),
        data: totalEntryData,
      });
      totalEmissions =
        totalActivityEmissions +
        totalUpstreamEmissions +
        totalBiogenicEmissions;
      return [stackedSideBarPercentageEntries, kgsToTons(totalEmissions)];
    }, [emissionCategoriesWithEmissions, t]);

  return (
    <div className="flex w-full flex-col gap-12 bg-light px-2 py-0 sm:px-12">
      <div className="mt-10 flex flex-wrap items-center justify-between gap-y-10">
        <span className="text-lg font-bold text-primary">
          {t('dashboard.form.allGHGEmissions.emissionBasedOnActivity')}
        </span>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <div className="flex items-center gap-2">
            <div
              className="h-5 w-[15px] rounded-[5px]"
              style={{ backgroundColor: '#414546' }}
            />
            <span className="text-xs font-bold text-primary ">
              <Trans i18nKey="dashboard.form.allGHGEmissions.activityTCO2e" />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-5 w-[15px] rounded-[5px]"
              style={{ backgroundColor: '#8A8A8A' }}
            />
            <span className="text-xs font-bold text-primary ">
              <Trans i18nKey="dashboard.form.allGHGEmissions.upstreamTCO2e" />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-5 w-[15px] rounded-[5px]"
              style={{ backgroundColor: '#1A1A1A' }}
            />
            <span className="text-xs font-bold text-primary ">
              <Trans i18nKey="dashboard.form.allGHGEmissions.biogenicTCO2e" />
            </span>
          </div>
        </div>
      </div>
      <StackedSideBarPercentageChartWithTotal
        data={stackedSideBarPercentageChartWithTotalEntries}
        unitLabel={t('dashboard.form.emissionsSummary.tCO2e')}
        barHeight={20}
        total={totalEmissions}
      />
    </div>
  );
}
