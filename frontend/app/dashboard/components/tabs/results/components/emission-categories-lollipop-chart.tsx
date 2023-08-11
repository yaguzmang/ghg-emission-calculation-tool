'use client';

import {
  useSelectedLocale,
  useSelectedReportingPeriodId,
} from '@/redux/store/ui/shared';
import { LollipopChart } from '@/components/charts/lollipop-chart';
import { Trans } from 'react-i18next';
import { useGetEmissionsResultsByReportingPeriodQuery } from '@/redux/api/emission-results/emissionResultsApiSlice';
import { useMemo } from 'react';
import { EmissionCategoryTotalByEmissionType } from '@/types/emission-result';
import { calculateTotalEmissionsByCategoryAndEmissionType } from '@/lib/data/utils';
const data = [
  { label: 'Energy', value: 90, color: null },
  { label: 'Vehicles', value: 12, color: null },
  { label: 'Fugitive Emissions', value: 34, color: null },
  { label: 'Delivered Electricity', value: 53, color: null },
  { label: 'Delivered Heating Energy', value: 98, color: null },
  { label: 'Transport Of Goods', value: 23, color: null },
];
//todo: go to dashboard and see how to get totals by category

export function EmissionCategoriesLollipopChart() {
  const selectedLocale = useSelectedLocale();
  const selectedReportingPeriodId = useSelectedReportingPeriodId('results');
  const emissionResults = useGetEmissionsResultsByReportingPeriodQuery(
    {
      reportingPeriodId: selectedReportingPeriodId?? 0,
      locale: selectedLocale ?? (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as string),
    },
    {
      skip: selectedReportingPeriodId === undefined || selectedLocale === undefined,
    },
  );

  let totalAllGHGEmissions: null | number = null;

  const emissionsDataArray = useMemo<
    EmissionCategoryTotalByEmissionType[][]
  >(() => {
    if (emissionResults.currentData) {
      return [
        calculateTotalEmissionsByCategoryAndEmissionType(
          emissionResults.currentData,
          'scope1',
        ),
        calculateTotalEmissionsByCategoryAndEmissionType(
          emissionResults.currentData,
          'scope2',
        ),
        calculateTotalEmissionsByCategoryAndEmissionType(
          emissionResults.currentData,
          'scope3',
        ),
      ];
    }
    return [];
  }, [emissionResults.currentData]);

  if (emissionResults.currentData) {
    totalAllGHGEmissions =
      (emissionResults.currentData.totalEmissions.scope1.emissions ?? 0) +
      (emissionResults.currentData.totalEmissions.scope2.emissions ?? 0) +
      (emissionResults.currentData.totalEmissions.scope3.emissions ?? 0);
  }
  return (
    // TODO: Fit height/ set minimum height
    <div className="w-full h-full min-h-[300px] flex flex-col">
      <span className="text-lg text-text-regular mr-auto ml-7 py-[1px]">
        <Trans i18nKey="dashboard.form.emissionsSummary.tCO2e" />
      </span>
      <LollipopChart data={data} />
    </div>
  );
}
