import { useTranslation } from 'react-i18next';

import { EmissionsComparerCharts } from './emissions-comparer-charts';

import { useGetReportingPeriodsByOrganizationQuery } from '@/redux/api/reporting-periods/reportingPeriodsApiSlice';
import {
  useSelectedEmissionCategoryId,
  useSelectedLocale,
  useSelectedOrganizationId,
  useSelectedOrganizationUnitId,
} from '@/redux/store/ui/shared/hooks';

export function EmissionsComparerChartsContainer() {
  const { t } = useTranslation();
  const selectedLocale = useSelectedLocale();
  const selectedOrganizationIdInForm = useSelectedOrganizationId('form');
  const selectedOrganizationId =
    useSelectedOrganizationId('home') ?? selectedOrganizationIdInForm;
  const selectedOrganizationUnitId = useSelectedOrganizationUnitId('home');
  const selectedEmissionCategoryId = useSelectedEmissionCategoryId('home');

  const reportingPeriods = useGetReportingPeriodsByOrganizationQuery(
    selectedOrganizationId ?? 0,
    { skip: selectedOrganizationId === undefined },
  );

  return (
    <div className="flex flex-col gap-7">
      {reportingPeriods.currentData !== undefined && (
        <EmissionsComparerCharts
          reportingPeriods={reportingPeriods.currentData
            .slice()
            .sort((a, b) => {
              const dateA = new Date(a.attributes.endDate).getTime();
              const dateB = new Date(b.attributes.endDate).getTime();
              return dateB - dateA;
            })}
          organizationUnitId={selectedOrganizationUnitId}
          emissionCategoryId={selectedEmissionCategoryId}
          locale={selectedLocale}
        />
      )}
      {reportingPeriods.isLoading && <p>{t('api.loading.generic')}</p>}
    </div>
  );
}
