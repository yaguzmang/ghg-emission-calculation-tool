'use client';

import { Trans, useTranslation } from 'react-i18next';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion';

import { Button } from '../ui/button';
import { EmissionsSummaryGraph } from './emissions-summary-graph';

import { Icons } from '@/components/ui/icons/icons';
import { kgsToTons } from '@/lib/numbers.ts/conversion';
import { cn } from '@/lib/utils';
import { useGetEmissionCategoriesWithEmissionsQuery } from '@/redux/api/emission-categories/emissionCategoriesApiSlice';
import { useGetEmissionsResultsByReportingPeriodQuery } from '@/redux/api/emission-results/emissionResultsApiSlice';

interface AllEmissionsSummarySectionProps {
  reportingPeriodId: number | undefined;
  locale: string | undefined;
}

export function AllEmissionsSummarySection({
  reportingPeriodId,
  locale,
}: AllEmissionsSummarySectionProps) {
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

  const emissionCategoriesWithEmissions =
    useGetEmissionCategoriesWithEmissionsQuery(
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

  const totalIndirectEmissions =
    emissionResults.currentData?.totalEmissions?.scope2?.emissions ?? 0;

  const totalValueChainEmissions =
    emissionResults.currentData?.totalEmissions?.scope3?.emissions ?? 0;

  const totalGHGEmissions =
    totalDirectEmissions + totalIndirectEmissions + totalValueChainEmissions;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="emission-summary-graph">
        <div className="flex flex-col w-full max-w-[1264px] bg-emission text-emission-foreground min-h-[5.5rem] justify-between px-5 py-4 rounded-[2px]">
          <div className="flex flex-row justify-between items-center flex-wrap gap-4">
            <div className="flex gap-2 items-center">
              <span>
                <Icons.DirectEmissions className="h-6 w-6" />
              </span>
              <span>
                <Icons.IndirectEmissions className="h-6 w-6" />
              </span>
              <span>
                <Icons.ValueChainEmissions className="h-6 w-6" />
              </span>
              <span className="text-sm font-bold">
                {t('dashboard.form.allGHGEmissions')}
              </span>
            </div>
            <div className="flex gap-2">
              <span
                className={cn('text-2xl font-bold ', {
                  'text-emission-foreground-muted': totalGHGEmissions === 0,
                })}
              >
                {kgsToTons(totalGHGEmissions).toFixed(2)}
              </span>
              <span className="text-xs flex items-end">
                <span className="pb-1">
                  <Trans i18nKey="dashboard.form.emissionsSummary.tCO2e" />
                </span>
              </span>
            </div>
          </div>
          <div className="ml-auto">
            <AccordionTrigger
              asChild
              className="transition-all hover:underline [&[data-state=open]>svg]:rotate-180"
            >
              <Button
                type="button"
                variant="icon"
                size="fit"
                className="text-emission-foreground hover:text-emission-foreground"
                disabled={
                  emissionCategoriesWithEmissions.currentData === undefined
                }
              >
                <span className="pr-2">
                  {t('dashboard.form.emissionsSummary.showResults')}
                </span>
                <Icons.ArrowsDownSmall className="h-2 w-2" />
              </Button>
            </AccordionTrigger>
          </div>
        </div>
        <AccordionContent className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          {emissionCategoriesWithEmissions.currentData !== undefined ? (
            <EmissionsSummaryGraph
              emissionCategoriesWithEmissions={
                emissionCategoriesWithEmissions.currentData
              }
            />
          ) : null}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
