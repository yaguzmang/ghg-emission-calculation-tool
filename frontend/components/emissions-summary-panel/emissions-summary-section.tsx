import { Trans, useTranslation } from 'react-i18next';

import { Icons } from '@/components/ui/icons/icons';
import { kgsToTons } from '@/lib/numbers.ts/conversion';
import { getAccuracyReliability } from '@/lib/statistics/utils';
import { cn } from '@/lib/utils';

interface EmissionsSummarySectionProps {
  sectionType: 'directEmissions' | 'indirectEmissions' | 'valueChainEmissions';
  totalEmissions: number;
  sectionEmissions: number;
  accuracy: number | null | undefined;
}

export function EmissionsSummarySection({
  sectionType,
  totalEmissions,
  sectionEmissions,
  accuracy,
}: EmissionsSummarySectionProps) {
  const { t } = useTranslation();

  const sectionEmissionsPercentage =
    totalEmissions > 0 ? (sectionEmissions * 100) / totalEmissions : 0;

  const iconsBySectionType: Record<typeof sectionType, JSX.Element | null> = {
    directEmissions: <Icons.DirectEmissions className="h-6 w-6 pt-1" />,
    indirectEmissions: <Icons.IndirectEmissions className="h-6 w-6 pt-1" />,
    valueChainEmissions: <Icons.ValueChainEmissions className="h-6 w-6 pt-1" />,
  };

  const titlesBySectionType: Record<typeof sectionType, string> = {
    directEmissions: t('dashboard.form.directEmissions'),
    indirectEmissions: t('dashboard.form.indirectEmissions'),
    valueChainEmissions: t('dashboard.form.valueChainEmissions'),
  };

  const accuracyReliability =
    typeof accuracy === 'number' ? getAccuracyReliability(accuracy) : null;

  const accuracyLabelByReliability: Record<'low' | 'medium' | 'high', string> =
    {
      low: t('dashboard.form.emissionsSummary.lowAccuracy'),
      medium: t('dashboard.form.emissionsSummary.mediumAccuracy'),
      high: t('dashboard.form.emissionsSummary.highAccuracy'),
    };

  return (
    <div className="flex w-full max-w-[400px] flex-col rounded-[2px] bg-emission px-5 py-4 text-emission-foreground">
      <div className="flex w-full flex-row flex-wrap justify-between gap-4 gap-y-8">
        <div className="flex flex-row">
          {iconsBySectionType[sectionType]}
          <span className="ml-2 w-min min-w-min break-normal align-top text-sm font-bold uppercase">
            {titlesBySectionType[sectionType]}
          </span>
        </div>

        <div className="grid grid-cols-[min-content_1fr] items-center gap-3">
          <span
            className={cn(
              'text-right text-[1.75rem] font-bold leading-9 tracking-widest',
              {
                'text-emission-foreground-muted': sectionEmissions === 0,
              },
            )}
          >
            {kgsToTons(sectionEmissions).toFixed(2)}
          </span>
          <span className="w-min text-xs font-normal">
            <Trans i18nKey="dashboard.form.emissionsSummary.tCO2e" />
          </span>
          <span
            className={cn(
              'text-right text-[1.75rem] font-bold leading-9 tracking-widest',
              {
                'text-emission-foreground-muted': sectionEmissions === 0,
              },
            )}
          >
            {sectionEmissionsPercentage.toFixed(2)}
          </span>
          <span className="w-min whitespace-nowrap text-xs font-normal">
            {t('dashboard.form.emissionsSummary.percentOfAll')}
          </span>
        </div>
      </div>
      {typeof accuracy === 'number' && (
        <div className="flex w-full flex-col">
          <span className="text-xs">
            {t('dashboard.form.emissionsSummary.accuracyOfResults')}
          </span>
          <div
            className={cn(
              'mt-1 flex h-[10px] w-full rounded-full bg-emission-secondary',
              { 'justify-start': accuracyReliability === 'low' },
              { 'justify-center': accuracyReliability === 'medium' },
              { 'justify-end': accuracyReliability === 'high' },
            )}
          >
            <div
              className={cn(
                'flex h-full w-24 flex-col items-center justify-center rounded-full text-center align-middle text-[8px]',
                {
                  hidden:
                    accuracyReliability === null || sectionEmissions === 0,
                },
                {
                  'bg-gradient-to-r from-accuracy-low-gradient-from to-accuracy-low-gradient-to':
                    accuracyReliability === 'low',
                },
                {
                  'bg-gradient-to-r from-accuracy-medium-gradient-from to-accuracy-medium-gradient-to':
                    accuracyReliability === 'medium',
                },
                {
                  'bg-gradient-to-r from-accuracy-high-gradient-from to-accuracy-high-gradient-to':
                    accuracyReliability === 'high',
                },
              )}
            >
              {accuracyReliability !== null && accuracyReliability !== '' && (
                <span className="text-primary">
                  {accuracyLabelByReliability[accuracyReliability]}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
