'use client';

import { useTranslation } from 'react-i18next';

import { GHGEmissionsByCategoryAndOrganizationUnitBarChart } from './ghg-emissions-by-category-and-organization-unit-bar-chart';

interface GHGEmissionsByCategoryAndOrganizationUnitContainerProps {
  reportingPeriodId: number | undefined;
  locale: string | undefined;
}

export function GHGEmissionsByCategoryAndOrganizationUnitContainer({
  reportingPeriodId,
  locale,
}: GHGEmissionsByCategoryAndOrganizationUnitContainerProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-10">
      <div className="flex w-full flex-wrap items-center justify-between gap-y-8 bg-background px-2 py-8 shadow-md sm:px-8">
        <div className="max-w-[550px]">
          <h2 className="break-normal">
            {t('results.ghgEmissionsByCategoryOverUnit')}
          </h2>
        </div>
      </div>
      <GHGEmissionsByCategoryAndOrganizationUnitBarChart
        reportingPeriodId={reportingPeriodId}
        locale={locale}
      />
    </div>
  );
}
