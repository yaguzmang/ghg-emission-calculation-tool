import { EmissionsSummarySection } from './emissions-summary-section';

import {
  calculateTotalDirectEmissions,
  calculateTotalEmissions,
  calculateTotalIndirectEmissions,
  calculateTotalValueChainEmissions,
} from '@/lib/statistics/utils';
import { useGetEmissionCategoriesWithEmissionsQuery } from '@/redux/api/emission-categories/emissionCategoriesApiSlice';
import {
  useSelectedLocale,
  useSelectedReportingPeriodId,
} from '@/redux/store/ui/shared';

export function EmissionsSummary() {
  const selectedLocale = useSelectedLocale();
  const selectedReportingPeriodId = useSelectedReportingPeriodId('form');

  const emissionCategoriesWithEmissions =
    useGetEmissionCategoriesWithEmissionsQuery(
      {
        locale: selectedLocale ?? '',
        reportingPeriod: selectedReportingPeriodId ?? 0,
      },
      {
        skip:
          selectedLocale === undefined ||
          selectedReportingPeriodId === undefined,
      }
    );

  const totalEmissions = calculateTotalEmissions(
    emissionCategoriesWithEmissions.currentData ?? []
  );
  const totalDirectEmissions = calculateTotalDirectEmissions(
    emissionCategoriesWithEmissions.currentData ?? []
  );
  const totalIndirectEmissions = calculateTotalIndirectEmissions(
    emissionCategoriesWithEmissions.currentData ?? []
  );
  const totalBiogenicEmissions = calculateTotalValueChainEmissions(
    emissionCategoriesWithEmissions.currentData ?? []
  );
  return (
    <div className="mt-8 flex flex-row flex-wrap gap-4 gap-y-8 rounded-[2px] bg-primary p-4 text-primary-foreground drop-shadow-[1px_2px_5px_rgba(0,0,0,0.1)]">
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
  );
}
