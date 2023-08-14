import { useTranslation } from 'react-i18next';

import { AllEmissionsSummarySection } from './all-emissions-summary-section';
import { EmissionsSummarySection } from './emissions-summary-section';

import { useGetEmissionsResultsByReportingPeriodQuery } from '@/redux/api/emission-results/emissionResultsApiSlice';

interface EmissionsSummaryPanelProps {
  reportingPeriodId: number | undefined;
  locale: string | undefined;
  includeAccuracy: boolean;
}

export function EmissionsSummaryPanel({
  reportingPeriodId,
  locale,
  includeAccuracy,
}: EmissionsSummaryPanelProps) {
  const { t } = useTranslation();

  const emissionResults = useGetEmissionsResultsByReportingPeriodQuery(
    {
      locale: locale ?? '',
      reportingPeriodId: reportingPeriodId ?? 0,
    },
    {
      skip: locale === undefined || reportingPeriodId === undefined,
    },
  );

  const totalDirectEmissions =
    emissionResults.currentData?.totalEmissions?.scope1?.emissions ?? 0;

  const directEmissionsAccuracy =
    emissionResults.currentData?.totalEmissions?.scope1?.accuracy ?? null;

  const totalIndirectEmissions =
    emissionResults.currentData?.totalEmissions?.scope2?.emissions ?? 0;

  const indirectEmissionsAccuracy =
    emissionResults.currentData?.totalEmissions?.scope2?.accuracy ?? null;

  const totalValueChainEmissions =
    emissionResults.currentData?.totalEmissions?.scope3?.emissions ?? 0;

  const valueChainEmissionsAccuracy =
    emissionResults.currentData?.totalEmissions?.scope3?.accuracy ?? null;

  const totalGHGEmissions =
    totalDirectEmissions + totalIndirectEmissions + totalValueChainEmissions;

  let errorMessage = null;
  // TODO: Turn this logic into a component or lib to get error messages
  if (emissionResults.isError) {
    if (
      'status' in emissionResults.error &&
      emissionResults.error.status === 404
    ) {
      errorMessage = t('api.error.emissionFactorDataNotFound');
    } else if (
      'status' in emissionResults.error &&
      emissionResults.error.status === 400
    ) {
      errorMessage = t('api.error.emissionFactorDataGeneric');
    } else {
      errorMessage = t('api.error.generic');
    }
  }

  return (
    <>
      {emissionResults.isError && (
        <div className="mr-0 basis-full text-destructive">{errorMessage}</div>
      )}
      <div className="flex flex-col gap-5 w-full">
        <AllEmissionsSummarySection
          reportingPeriodId={reportingPeriodId}
          locale={locale}
        />
        <div className="flex flex-row flex-wrap gap-x-8 gap-y-4">
          <EmissionsSummarySection
            sectionType="directEmissions"
            totalEmissions={totalGHGEmissions}
            sectionEmissions={totalDirectEmissions}
            accuracy={includeAccuracy ? directEmissionsAccuracy : undefined}
          />
          <EmissionsSummarySection
            sectionType="indirectEmissions"
            totalEmissions={totalGHGEmissions}
            sectionEmissions={totalIndirectEmissions}
            accuracy={includeAccuracy ? indirectEmissionsAccuracy : undefined}
          />
          <EmissionsSummarySection
            sectionType="valueChainEmissions"
            totalEmissions={totalGHGEmissions}
            sectionEmissions={totalValueChainEmissions}
            accuracy={includeAccuracy ? valueChainEmissionsAccuracy : undefined}
          />
        </div>
      </div>
    </>
  );
}
