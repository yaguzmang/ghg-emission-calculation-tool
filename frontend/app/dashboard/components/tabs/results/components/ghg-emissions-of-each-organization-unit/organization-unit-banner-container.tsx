'use client';

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
    <div className="flex flex-col gap-4">
      {emissionResults.currentData &&
        emissionResults.currentData.organizationUnits.map(
          (orgUnitmissionResults) => (
              <OrganizationUnitBanner
                reportingPeriodId={reportingPeriodId}
                locale={locale}
                organizationUnitEmissionResults={orgUnitmissionResults}
              />
            ),
        )}
    </div>
  );
}
