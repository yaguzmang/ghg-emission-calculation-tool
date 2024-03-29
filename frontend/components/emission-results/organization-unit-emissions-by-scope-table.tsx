import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { EmissionIconsByScope } from '@/components/ui/icons/icons';
import { kgsToTons } from '@/lib/numbers.ts/conversion';
import { cn } from '@/lib/utils';
import { EmissionCategoryTotalByEmissionType } from '@/types/emission-result';

interface OrganizationUnitEmissionsByScopeTableProps {
  emissionsDataArray: EmissionCategoryTotalByEmissionType[][];
  organizationUnitId: number;
  totalOrganizationUnitGHGEmissions: number;
}

export default function OrganizationUnitEmissionsByScopeTable({
  emissionsDataArray,
  totalOrganizationUnitGHGEmissions,
  organizationUnitId,
}: OrganizationUnitEmissionsByScopeTableProps) {
  const { t } = useTranslation();

  return (
    <table className="w-full table-auto text-right">
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

          const totalScopeEmissions = emissionsData.reduce(
            (acc, category) => acc + category.totalEmissions,
            0,
          );

          const totalScopeEmissionsPercentage =
            totalOrganizationUnitGHGEmissions
              ? (totalScopeEmissions / totalOrganizationUnitGHGEmissions) * 100
              : 0;
          return (
            <React.Fragment
              key={`org-unit-${organizationUnitId}-${emissionScopeKey}`}
            >
              <tr className="border-b border-b-ring">
                <th
                  className={cn('pb-2 text-left', {
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
                  className={cn('pb-2 text-2xl font-normal leading-7', {
                    'pt-10': scopeIndex > 0,
                    'text-primary-disabled-foreground':
                      totalScopeEmissionsPercentage === 0,
                  })}
                >
                  {totalScopeEmissionsPercentage.toFixed(2)}
                </th>
                <th
                  className={cn('pb-2 pl-8 text-2xl font-bold leading-7', {
                    'pt-10': scopeIndex > 0,
                    'text-primary-disabled-foreground':
                      totalScopeEmissionsPercentage === 0,
                  })}
                >
                  {kgsToTons(totalScopeEmissions).toFixed(2)}
                </th>
              </tr>

              {emissionsData.map((category) => {
                const categoryTotalEmissionsPercentage =
                  totalOrganizationUnitGHGEmissions
                    ? (category.totalEmissions /
                        totalOrganizationUnitGHGEmissions) *
                      100
                    : 0;

                return (
                  <tr className="text-text-regular" key={category.title}>
                    <td className="flex items-center gap-2 pt-4 text-left">
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
                      <span>{categoryTotalEmissionsPercentage.toFixed(2)}</span>
                    </td>
                    <td className="pl-8 pt-4">
                      <span>
                        {kgsToTons(category.totalEmissions).toFixed(2)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
