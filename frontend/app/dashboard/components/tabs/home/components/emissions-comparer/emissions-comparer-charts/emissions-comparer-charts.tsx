import { useMemo, useState } from 'react';

import { EmissionsData } from './emissions-data';

import { getHighestTotalEmissionsOfResultsByReportingPeriodId } from '@/lib/data/organizations-utils';
import {
  EmissionResults,
  EmissionResultsPerReportinPeriodId,
} from '@/types/emission-result';
import { ReportingPeriod } from '@/types/reporting-period';

interface EmissionsComparerChartsProps {
  organizationUnitId: number | undefined;
  emissionCategoryId: number | undefined;
  reportingPeriods: ReportingPeriod[];
  locale: string | undefined;
}

export function EmissionsComparerCharts({
  organizationUnitId,
  emissionCategoryId,
  reportingPeriods,
  locale,
}: EmissionsComparerChartsProps) {
  const [emissionResultsPerPeriod, setEmissionResultsPerPeriod] =
    useState<EmissionResultsPerReportinPeriodId>(
      {} as EmissionResultsPerReportinPeriodId,
    );

  const handleEmissionResultsPerPeriodChange = (
    reportingPeriodId: number,
    results: EmissionResults | 'loading' | 'error',
  ) => {
    setEmissionResultsPerPeriod((prevResults) => ({
      ...prevResults,
      [reportingPeriodId.toString()]: results,
    }));
  };

  const highestTotalEmissions = useMemo(() => getHighestTotalEmissionsOfResultsByReportingPeriodId(
      emissionResultsPerPeriod,
    ), [emissionResultsPerPeriod]);

  return (
    <div className="flex flex-col gap-7">
      {reportingPeriods?.map((reportingPeriod) => (
          <div
            className="flex flex-col gap-2"
            key={`reporting-periods-comparer-${reportingPeriod.id}`}
          >
            <div className="flex font-bold text-black">
              {reportingPeriod.attributes.name !== '' && (
                <span className="mr-2">{reportingPeriod.attributes.name}</span>
              )}
              <span className="flex gap-2">
                <span>
                  {reportingPeriod?.attributes.startDate.replaceAll('-', '.')}
                </span>
                <span>-</span>
                <span>
                  {reportingPeriod?.attributes.endDate.replaceAll('-', '.')}
                </span>
              </span>
            </div>
            <EmissionsData
              emissionResultsPerReportingPeriodId={emissionResultsPerPeriod}
              highestTotalEmissions={highestTotalEmissions}
              onEmissionResultsChange={handleEmissionResultsPerPeriodChange}
              reportingPeriodId={reportingPeriod.id}
              organizationUnitId={organizationUnitId}
              emissionCategoryId={emissionCategoryId}
              locale={locale}
            />
          </div>
        ))}
    </div>
  );
}
