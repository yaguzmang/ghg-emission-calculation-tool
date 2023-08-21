'use client';

import { useTranslation } from 'react-i18next';

import { OrganizationUnitBanner } from './organization-unit-banner';

import { useGetEmissionsResultsByReportingPeriodQuery } from '@/redux/api/emission-results/emissionResultsApiSlice';

interface OrganizationUnitBannerContainerProps {
  reportingPeriodId: number | undefined;
  locale: string | undefined;
}

export function OrganizationUnitBannerContainer({
  reportingPeriodId,
  locale,
}: OrganizationUnitBannerContainerProps) {
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

  return (
    <div className="border-t">
      {emissionResults.currentData && (
        <h2 className="break-normal my-10 px-2 sm:px-8">
          {t('results.GHGEmissionsOfEachUnit')}
        </h2>
      )}
      <div className="flex flex-col gap-4">
        {emissionResults.currentData &&
          emissionResults.currentData.organizationUnits.map(
            (orgUnitmissionResults) => (
              <OrganizationUnitBanner
                key={`org-unit-banner-${orgUnitmissionResults.id}`}
                reportingPeriodId={reportingPeriodId}
                locale={locale}
                organizationUnitEmissionResults={orgUnitmissionResults}
              />
            ),
          )}
      </div>
    </div>
  );
}
