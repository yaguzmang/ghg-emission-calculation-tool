import { Trans, useTranslation } from 'react-i18next';

import { Icons } from '@/components/ui/icons/icons';
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
    <div className="flex flex-col w-full max-w-[400px] px-5 py-4 rounded-[2px] bg-emission text-emission-foreground">
      <div className="flex flex-row flex-wrap justify-between gap-4 gap-y-8 w-full">
        <div className="flex flex-row">
          {iconsBySectionType[sectionType]}
          <span className="w-min min-w-min break-normal text-sm font-bold uppercase ml-2 align-top">
            {titlesBySectionType[sectionType]}
          </span>
        </div>

        <div className="grid gap-3 items-center grid-cols-[min-content_1fr]">
          <span
            className={cn(
              'text-[1.75rem] font-bold leading-9 tracking-widest text-right',
              {
                'text-emission-foreground-muted': sectionEmissions === 0,
              },
            )}
          >
            {sectionEmissions.toFixed(2)}
          </span>
          <span className="text-xs font-normal w-min">
            <Trans i18nKey="dashboard.form.emissionsSummary.tCO2e" />
          </span>
          <span
            className={cn(
              'text-[1.75rem] font-bold leading-9 tracking-widest text-right',
              {
                'text-emission-foreground-muted': sectionEmissions === 0,
              },
            )}
          >
            {sectionEmissionsPercentage.toFixed(2)}
          </span>
          <span className="text-xs font-normal w-min whitespace-nowrap">
            {t('dashboard.form.emissionsSummary.percentOfAll')}
          </span>
        </div>
      </div>
      {typeof accuracy === 'number' && (
        <div className="w-full flex flex-col">
          <span className="text-xs">
            {t('dashboard.form.emissionsSummary.accuracyOfResults')}
          </span>
          <div
            className={cn(
              'h-[10px] w-full bg-emission-secundary rounded-full mt-1 flex',
              { 'justify-start': accuracyReliability === 'low' },
              { 'justify-center': accuracyReliability === 'medium' },
              { 'justify-end': accuracyReliability === 'high' },
            )}
          >
            <div
              className={cn(
                'h-full w-24 rounded-full text-[8px] flex flex-col items-center justify-center align-middle text-center',
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
