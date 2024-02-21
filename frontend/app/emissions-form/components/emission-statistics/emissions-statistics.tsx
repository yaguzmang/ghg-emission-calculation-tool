import { useTranslation } from 'react-i18next';

import { CategoryGHGEmissionsByOrganizationUnit } from './category-emissions-by-organization-unit';
import { FormEmissionCategoriesLollipopChart } from './form-emission-categories-lollipop-chart';

import AllCategoryEmissionsSummary from '@/components/emission-results/all-category-emissions-summary';
import EmissionsByScopeTable from '@/components/emission-results/emissions-by-scope-table';
import { Skeleton } from '@/components/ui/skeleton';
import { UserWalkthrough } from '@/components/user-walkthrough/user-walkthrough';
import { useGetReportingPeriodQuery } from '@/redux/api/reporting-periods/reportingPeriodsApiSlice';
import { UserWalkthroughStep } from '@/redux/store/ui/shared/stateType';

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
    <div className="flex h-full w-full flex-col">
      <span className="text-lg text-text-regular">
        <UserWalkthrough
          isButton={false}
          step={UserWalkthroughStep.formStatisticsInformation}
        >
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
        </UserWalkthrough>
      </span>

      <AllCategoryEmissionsSummary
        emissionCategoryId={emissionCategoryId}
        reportingPeriodId={reportingPeriodId}
        locale={locale}
      />

      <div className="mt-16 w-full">
        <FormEmissionCategoriesLollipopChart
          emissionCategoryId={emissionCategoryId}
          reportingPeriodId={reportingPeriodId}
          locale={locale}
        />
      </div>

      <div className="mt-16 w-full">
        <EmissionsByScopeTable
          reportingPeriodId={reportingPeriodId}
          locale={locale}
        />
      </div>

      <div className="mt-16 w-full">
        <CategoryGHGEmissionsByOrganizationUnit
          emissionCategoryId={emissionCategoryId}
          reportingPeriodId={reportingPeriodId}
          locale={locale}
        />
      </div>
    </div>
  );
}
