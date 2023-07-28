import { useTranslation } from 'react-i18next';

import { EmissionsSummarySection } from './emissions-summary-section';

import {
  calculateTotalDirectEmissionsFromEmissionCategories,
  calculateTotalEmissionsFromEmissionCategories,
  calculateTotalIndirectEmissionsFromEmissionCategories,
  calculateTotalValueChainEmissionsFromEmissionCategories,
} from '@/lib/statistics/utils';
import { cn } from '@/lib/utils';
import { useGetEmissionCategoriesWithEmissionsQuery } from '@/redux/api/emission-categories/emissionCategoriesApiSlice';
import {
  useSelectedLocale,
  useSelectedReportingPeriodId,
} from '@/redux/store/ui/shared';

export function EmissionsSummary() {
  const { t } = useTranslation();
  const selectedLocale = useSelectedLocale();
  const selectedReportingPeriodId = useSelectedReportingPeriodId('form');

  const {
    isError,
    error,
    currentData: emissionCategoriesWithEmissions,
  } = useGetEmissionCategoriesWithEmissionsQuery(
    {
      locale: selectedLocale ?? '',
      reportingPeriodId: selectedReportingPeriodId ?? 0,
    },
    {
      skip:
        selectedLocale === undefined || selectedReportingPeriodId === undefined,
    },
  );

  const totalEmissions = calculateTotalEmissionsFromEmissionCategories(
    emissionCategoriesWithEmissions ?? [],
  );
  const totalDirectEmissions =
    calculateTotalDirectEmissionsFromEmissionCategories(
      emissionCategoriesWithEmissions ?? [],
    );
  const totalIndirectEmissions =
    calculateTotalIndirectEmissionsFromEmissionCategories(
      emissionCategoriesWithEmissions ?? [],
    );
  const totalBiogenicEmissions =
    calculateTotalValueChainEmissionsFromEmissionCategories(
      emissionCategoriesWithEmissions ?? [],
    );

  let errorMessage = null;
  // TODO: Turn this logic into a component or lib to get error messages
  if (isError) {
    if ('status' in error && error.status === 404) {
      errorMessage = t('api.error.emissionFactorDataNotFound');
    } else if ('status' in error && error.status === 400) {
      errorMessage = t('api.error.emissionFactorDataGeneric');
    } else {
      errorMessage = t('api.error.generic');
    }
  }

  return (
    <>
      {isError && (
        <div className="mr-0 basis-full text-destructive">{errorMessage}</div>
      )}
      <div
        className={cn(
          'flex flex-row flex-wrap gap-4 gap-y-8 rounded-[2px] bg-primary p-4 text-primary-foreground drop-shadow-[1px_2px_5px_rgba(0,0,0,0.1)]',
          {
            'mt-8': !isError,
          },
        )}
      >
        <EmissionsSummarySection
          sectionType="allEmissions"
          totalEmissions={totalEmissions}
          sectionEmissions={totalEmissions}
        />
        <EmissionsSummarySection
          sectionType="directEmissions"
          totalEmissions={totalEmissions}
          sectionEmissions={totalDirectEmissions}
        />
        <EmissionsSummarySection
          sectionType="indirectEmissions"
          totalEmissions={totalEmissions}
          sectionEmissions={totalIndirectEmissions}
        />
        <EmissionsSummarySection
          sectionType="valueChainEmissions"
          totalEmissions={totalEmissions}
          sectionEmissions={totalBiogenicEmissions}
        />
      </div>
    </>
  );
}
