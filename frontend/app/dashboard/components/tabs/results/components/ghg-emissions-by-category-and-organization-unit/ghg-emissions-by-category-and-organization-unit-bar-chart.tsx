'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  StackedSideBarPercentageChart,
  StackedSideBarPercentageChartEntry,
  StackedSideBarPercentageChartEntryData,
} from '@/components/charts/stacked-side-bar-percentage-chart';
import {
  calculateOrganizationUnitTotalEmissionsByCategoryAndEmissionType,
  calculateTotalAllEmissionPerCategory,
} from '@/lib/data/organizations-utils';
import { kgsToTons } from '@/lib/numbers.ts/conversion';
import { useGetEmissionsResultsByReportingPeriodQuery } from '@/redux/api/emission-results/emissionResultsApiSlice';
import { OrganizationUnitTotalGHGEmissionsPerCategory } from '@/types/organization-unit';

interface GHGEmissionsByCategoryAndOrganizationUnitBarChartProps {
  reportingPeriodId: number | undefined;
  locale: string | undefined;
}

export function GHGEmissionsByCategoryAndOrganizationUnitBarChart({
  reportingPeriodId,
  locale,
}: GHGEmissionsByCategoryAndOrganizationUnitBarChartProps) {
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

  const allOrganizationUnitEmissionsPerCategory = useMemo<
    OrganizationUnitTotalGHGEmissionsPerCategory[]
  >(() => {
    if (emissionResults.currentData === undefined) return [];
    const allOrgUnitEmissionsPerCategory: OrganizationUnitTotalGHGEmissionsPerCategory[] =
      [];
    emissionResults.currentData.organizationUnits.forEach(
      (orgUnitmissionResults) => {
        if (orgUnitmissionResults) {
          const totalEmissionsPerScope = [
            calculateOrganizationUnitTotalEmissionsByCategoryAndEmissionType(
              orgUnitmissionResults,
              'scope1',
            ),
            calculateOrganizationUnitTotalEmissionsByCategoryAndEmissionType(
              orgUnitmissionResults,
              'scope2',
            ),
            calculateOrganizationUnitTotalEmissionsByCategoryAndEmissionType(
              orgUnitmissionResults,
              'scope3',
            ),
          ];
          const totalEmissionsPerCategory =
            calculateTotalAllEmissionPerCategory(totalEmissionsPerScope);
          allOrgUnitEmissionsPerCategory.push({
            id: orgUnitmissionResults.id,
            name: orgUnitmissionResults.name,
            emissionsPerCategory: totalEmissionsPerCategory,
          });
        }
      },
    );
    return allOrgUnitEmissionsPerCategory;
  }, [emissionResults.currentData]);

  const stackedSideBarPercentageChartEntries = useMemo<
    StackedSideBarPercentageChartEntry[]
  >(() => {
    if (allOrganizationUnitEmissionsPerCategory.length === 0) return [];

    const stackedSideBarPercentageEntries: StackedSideBarPercentageChartEntry[] =
      [];
    allOrganizationUnitEmissionsPerCategory.forEach(
      (allOrgUnitEmissionsPerCategory) => {
        const entryData: StackedSideBarPercentageChartEntryData[] = [];
        allOrgUnitEmissionsPerCategory.emissionsPerCategory.forEach(
          (category) => {
            const entry: StackedSideBarPercentageChartEntryData = {
              label: category.title,
              color: category.color,
              value: kgsToTons(category.totalEmissions),
              scope: category.primaryScope,
            };
            entryData.push(entry);
          },
        );
        if (entryData.length === 0) return;
        stackedSideBarPercentageEntries.push({
          title: allOrgUnitEmissionsPerCategory.name,
          data: entryData,
        });
      },
    );
    return stackedSideBarPercentageEntries;
  }, [allOrganizationUnitEmissionsPerCategory]);

  return (
    <div className="w-full">
      <StackedSideBarPercentageChart
        data={stackedSideBarPercentageChartEntries}
        unitLabel={t('dashboard.form.emissionsSummary.tCO2e')}
        barHeight={50}
      />
    </div>
  );
}
