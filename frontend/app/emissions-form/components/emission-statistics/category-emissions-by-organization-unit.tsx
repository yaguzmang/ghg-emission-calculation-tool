'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  SideBarPercentageChart,
  SideBarPercentageChartEntry,
} from '@/components/charts/side-bar-percentage-chart';
import { calculateTotalGHGEmissionsOfOrganizationUnit } from '@/lib/data/organizations-utils';
import { kgsToTons } from '@/lib/numbers.ts/conversion';
import { useGetEmissionsResultsByReportingPeriodQuery } from '@/redux/api/emission-results/emissionResultsApiSlice';
import { EmissionsTotalByCategory } from '@/types/emission-result';

interface CategoryGHGEmissionsByOrganizationUnitProps {
  emissionCategoryId: number;
  reportingPeriodId: number;
  locale: string;
}

export function CategoryGHGEmissionsByOrganizationUnit({
  emissionCategoryId,
  reportingPeriodId,
  locale,
}: CategoryGHGEmissionsByOrganizationUnitProps) {
  const { t } = useTranslation();
  const emissionResults = useGetEmissionsResultsByReportingPeriodQuery(
    {
      reportingPeriodId: reportingPeriodId ?? -1,
      locale: locale ?? '',
    },
    {
      skip: reportingPeriodId === undefined || locale === undefined,
    },
  );

  const [sideBarPercentageChartEntries, categoryTitle] = useMemo<
    [SideBarPercentageChartEntry[], string]
  >(() => {
    let foundCategoryTittle = '';
    if (emissionResults.currentData === undefined) return [[], ''];
    const chartEntries: SideBarPercentageChartEntry[] = [];
    emissionResults.currentData.organizationUnits.forEach(
      (orgUnitmissionResults) => {
        const categoryScope1Emissions =
          orgUnitmissionResults.emissions.scope1.find(
            (category) => category.id === emissionCategoryId,
          );
        const categoryScope2Emissions =
          orgUnitmissionResults.emissions.scope2.find(
            (category) => category.id === emissionCategoryId,
          );
        const categoryScope3Emissions =
          orgUnitmissionResults.emissions.scope3.find(
            (category) => category.id === emissionCategoryId,
          );
        const categoryWithEmissions: EmissionsTotalByCategory | undefined =
          categoryScope1Emissions ??
          categoryScope2Emissions ??
          categoryScope3Emissions;

        if (categoryWithEmissions === undefined) return;

        const totalCategoryEmissions =
          (categoryScope1Emissions?.emissions ?? 0) +
          (categoryScope2Emissions?.emissions ?? 0) +
          (categoryScope3Emissions?.emissions ?? 0);

        if (totalCategoryEmissions === 0) return;

        const totalOrganizationUnitGHGEmissions =
          calculateTotalGHGEmissionsOfOrganizationUnit(orgUnitmissionResults);

        chartEntries.push({
          title: orgUnitmissionResults.name,
          value: kgsToTons(totalCategoryEmissions),
          total: kgsToTons(totalOrganizationUnitGHGEmissions),
          color: categoryWithEmissions.color,
        });
        if (foundCategoryTittle === '')
          foundCategoryTittle = categoryWithEmissions.title;
      },
    );
    return [chartEntries, foundCategoryTittle];
  }, [emissionResults.currentData, emissionCategoryId]);

  return (
    <div className="flex w-full flex-col gap-4">
      <span className="pl-[10px] text-lg font-bold">
        {t('dashboard.form.emissionSummary.allCategoryEmissionsOverUnit', {
          categoryTitle,
        })}
      </span>
      <SideBarPercentageChart
        data={sideBarPercentageChartEntries}
        unitLabel={t('dashboard.form.emissionsSummary.tCO2e')}
        barHeight={50}
      />
    </div>
  );
}
