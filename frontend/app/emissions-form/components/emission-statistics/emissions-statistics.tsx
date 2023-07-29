import { useTranslation } from 'react-i18next';

import AllCategoryEmissionsSummary from './all-category-emissions-summary';
import EmissionsByScopeTable from './emissions-by-scope-table';

import { Skeleton } from '@/components/ui/skeleton';
import { useGetReportingPeriodQuery } from '@/redux/api/reporting-periods/reportingPeriodsApiSlice';

interface EmissionsFormStatisticsProps {
  emissionCategoryId: number;
  reportingPeriodId: number;
  locale: string;
}

export default function EmissionsFormStatistics({
  emissionCategoryId,
  reportingPeriodId,
  locale,
}: EmissionsFormStatisticsProps) {
  const { t } = useTranslation();
  const reportingPeriod = useGetReportingPeriodQuery(reportingPeriodId);

  return (
    <div className="flex flex-col py-6 px-12 w-full h-full">
        <span className="text-lg text-text-regular">
          {reportingPeriod.currentData !== undefined && !reportingPeriod.isError
            ? `${reportingPeriod.currentData.attributes.name} - ${reportingPeriod.currentData.attributes.startDate} - ${reportingPeriod.currentData.attributes.endDate}`
            : reportingPeriod.isFetching && (
                <Skeleton className="inline-block h-full w-64" />
              )}
          {reportingPeriod.isError && (
            <h4 className="text-destructive">
              {t('api.error.reportingPeriodGeneric')}
            </h4>
          )}
        </span>

        <AllCategoryEmissionsSummary
          emissionCategoryId={emissionCategoryId}
          reportingPeriodId={reportingPeriodId}
          locale={locale}
        />

        <div className="w-full mt-16">
          <EmissionsByScopeTable
            reportingPeriodId={reportingPeriodId}
            locale={locale}
          />
        </div>
      </div>
  );
}
