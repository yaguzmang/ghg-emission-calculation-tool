import { Trans, useTranslation } from 'react-i18next';

import { Icons } from '@/components/ui/icons/icons';
import { cn } from '@/lib/utils';

interface EmissionsSummarySectionProps {
  sectionType:
    | 'allEmissions'
    | 'directEmissions'
    | 'indirectEmissions'
    | 'valueChainEmissions';
  totalEmissions: number;
  sectionEmissions: number;
}

export function EmissionsSummarySection({
  sectionType,
  totalEmissions,
  sectionEmissions,
}: EmissionsSummarySectionProps) {
  const { t } = useTranslation();

  const sectionEmissionsPercentage =
    totalEmissions > 0 ? (sectionEmissions * 100) / totalEmissions : 0;

  const iconsBySectionType: Record<typeof sectionType, JSX.Element | null> = {
    allEmissions: null,
    directEmissions: <Icons.DirectEmissions className="m-2 h-6 w-6" />,
    indirectEmissions: <Icons.IndirectEmissions className="m-2 h-6 w-6" />,
    valueChainEmissions: <Icons.ValueChainEmissions className="m-2 h-6 w-6" />,
  };

  const titlesBySectionType: Record<typeof sectionType, string> = {
    allEmissions: t('dashboard.form.allGHGEmissions'),
    directEmissions: t('dashboard.form.directEmissions'),
    indirectEmissions: t('dashboard.form.indirectEmissions'),
    valueChainEmissions: t('dashboard.form.valueChainEmissions'),
  };

  return (
    <div
      className={cn('flex flex-row flex-wrap justify-between gap-4 gap-y-8', {
        'border-l': sectionType !== 'allEmissions',
      })}
    >
      <div className="pl-3">
        <div className="flex flex-row items-center">
          {iconsBySectionType[sectionType]}
          <div className="w-min min-w-min break-normal text-sm font-bold uppercase">
            {titlesBySectionType[sectionType]}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row items-center justify-between gap-4">
          <span className="text-[1.75rem] font-bold leading-9 tracking-widest">
            {sectionEmissions.toFixed(2)}
          </span>
          <span className="text-xs font-normal">
            <Trans i18nKey="dashboard.form.emissionsSummary.tCO2e" />
          </span>
        </div>
        {sectionType !== 'allEmissions' && (
          <div className="flex flex-row items-center justify-between gap-4">
            <span className="text-[1.75rem] font-bold leading-9 tracking-widest">
              {sectionEmissionsPercentage.toFixed(2)}%
            </span>
            <span className="text-xs font-normal">
              {t('dashboard.form.emissionsSummary.percentOfAll')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
