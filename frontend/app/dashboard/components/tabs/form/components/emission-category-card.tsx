import { Trans } from 'react-i18next';

import { EmissionIconsByScope } from '@/components/ui/icons/icons';
import { calculateTotalEmissionsOfEmissionCategory } from '@/lib/statistics/utils';
import { useGetEmissionCategoriesWithEmissionsQuery } from '@/redux/api/emission-categories/emissionCategoriesApiSlice';
import {
  useSelectedLocale,
  useSelectedReportingPeriodId,
} from '@/redux/store/ui/shared';
import { EmissionCategory } from '@/types/emission-category';

interface emissionCategoryCardProps {
  emissionCategory: EmissionCategory;
}

export function EmissionCategoryCard({
  emissionCategory,
}: emissionCategoryCardProps) {
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

  const emissionCategoryWithEmissions =
    emissionCategoriesWithEmissions.currentData?.find(
      (category) => category.id === emissionCategory.id
    );

  const categoryTotalEmissions =
    emissionCategoryWithEmissions !== undefined
      ? calculateTotalEmissionsOfEmissionCategory(emissionCategoryWithEmissions)
      : 0;

  const emissionIcon =
    EmissionIconsByScope[
      (emissionCategory.attributes
        .primaryScope as keyof typeof EmissionIconsByScope) ?? 1
    ];

  return (
    <div className="flex w-full max-w-[400px] flex-col bg-white p-5 drop-shadow-[1px_2px_5px_rgba(0,0,0,0.1)]">
      <div className="flex items-center">
        <span>{emissionIcon}</span>
        <span className="ml-4 text-xl font-bold uppercase">
          {emissionCategory.attributes.title}
        </span>
      </div>
      <div className="mt-5 flex items-center justify-end">
        <span className="text-xl font-bold text-light-disabled-foreground">
          {categoryTotalEmissions.toFixed(2)}
        </span>
        <span className="ml-4 w-min break-normal text-xs font-normal">
          <Trans i18nKey="dashboard.form.card.allGHGEmissions" />
        </span>
      </div>
    </div>
  );
}
