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
      <div className="w-full flex justify-between flex-wrap bg-background px-2 sm:px-8 py-8 items-center shadow-md gap-y-8">
        <div className="max-w-[470px]">
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
