import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { EmissionIconsByScope } from '@/components/ui/icons/icons';
import { calculateTotalEmissionsByCategoryAndEmissionType } from '@/lib/data/utils';
import { cn } from '@/lib/utils';
import { useGetEmissionsResultsByReportingPeriodQuery } from '@/redux/api/emission-results/emissionResultsApiSlice';
import { EmissionCategoryTotalByEmissionType } from '@/types/emission-result';

interface EmissionsByScopeTableProps {
  reportingPeriodId: number;
  locale: string;
}

export default function EmissionsByScopeTable({
  reportingPeriodId,
  locale,
}: EmissionsByScopeTableProps) {
  const { t } = useTranslation();

  const emissionResults = useGetEmissionsResultsByReportingPeriodQuery(
    {
      reportingPeriodId,
      locale,
    },
    {
      skip: reportingPeriodId === undefined || locale === undefined,
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
    <table className="table-auto w-full text-right">
      <thead>
        <tr className="text-lg text-text-regular">
          <th aria-label="Emission type" />
          <th className="font-normal">
            {'% '}
            {t('dashboard.form.emissionsSummary.percentOfTotalEmissions')}
          </th>
          <th className="font-normal">
            <Trans i18nKey="dashboard.form.emissionsSummary.tCO2e" />
          </th>
        </tr>
      </thead>
      <tbody className="text-lg">
        {emissionsDataArray.map((emissionsData, scopeIndex) => {
          const emissionScopeKey = `scope${scopeIndex + 1}`;
          return (
            <React.Fragment key={emissionScopeKey}>
              <tr className="border-b-ring border-b">
                <th
                  className={cn('text-left pb-2', {
                    'pt-10': scopeIndex > 0,
                  })}
                >
                  <h4>
                    {scopeIndex === 0 &&
                      t('dashboard.form.emissionSummary.directEmissions')}
                    {scopeIndex === 1 &&
                      t('dashboard.form.emissionSummary.indirectEmissions')}
                    {scopeIndex === 2 &&
                      t('dashboard.form.emissionSummary.valueChainEmissions')}
                  </h4>
                </th>
                <th
                  className={cn('pb-2 text-2xl leading-7 font-normal', {
                    'pt-10': scopeIndex > 0,
                  })}
                >
                  {totalAllGHGEmissions !== null &&
                  emissionResults.currentData?.totalEmissions[
                    emissionScopeKey as keyof typeof emissionResults.currentData.totalEmissions
                  ].emissions
                    ? (
                        ((emissionResults.currentData?.totalEmissions[
                          emissionScopeKey as keyof typeof emissionResults.currentData.totalEmissions
                        ]?.emissions ?? 0) /
                          totalAllGHGEmissions) *
                        100
                      ).toFixed(2)
                    : 0}
                </th>
                <th
                  className={cn('pb-2 text-2xl leading-7 font-bold pl-8', {
                    'pt-10': scopeIndex > 0,
                  })}
                >
                  {emissionResults.currentData?.totalEmissions[
                    emissionScopeKey as keyof typeof emissionResults.currentData.totalEmissions
                  ].emissions
                    ? emissionResults.currentData?.totalEmissions[
                        emissionScopeKey as keyof typeof emissionResults.currentData.totalEmissions
                      ].emissions.toFixed(2)
                    : 0}
                </th>
              </tr>

              {emissionsData.map((category) => (
                <tr className="text-text-regular" key={category.title}>
                  <td className="text-left flex items-center gap-2 pt-4">
                    <span
                      style={{
                        // Style is needed here because tailwind only loads colors that are present in the code.
                        color: category.color
                          ? category.color.toLocaleLowerCase()
                          : '',
                      }}
                    >
                      {
                        EmissionIconsByScope[
                          (category.primaryScope as keyof typeof EmissionIconsByScope) ??
                            1
                        ]
                      }
                    </span>
                    <span>{category.title}</span>
                  </td>
                  <td className="pt-4">
                    <span>
                      {totalAllGHGEmissions !== null &&
                        (
                          (category.totalEmissions / totalAllGHGEmissions) *
                          100
                        ).toFixed(2)}
                    </span>
                  </td>
                  <td className="pt-4 pl-8">
                    <span>{category.totalEmissions.toFixed(2)}</span>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
