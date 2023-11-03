'use client';

import { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion';

import { OrganizationUnitEmissionCategoriesLollipopChart } from './organization-unit-emission-categories-lollipop-chart';

import OrganizationUnitEmissionsByScopeTable from '@/components/emission-results/organization-unit-emissions-by-scope-table';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons/icons';
import {
  calculateOrganizationUnitTotalEmissionsByCategoryAndEmissionType,
  calculateTotalGHGEmissionsOfOrganizationUnit,
} from '@/lib/data/organizations-utils';
import { kgsToTons } from '@/lib/numbers.ts/conversion';
import { cn } from '@/lib/utils';
import {
  EmissionCategoryTotalByEmissionType,
  EmissionResultsByOrganizationUnit,
} from '@/types/emission-result';

interface OrganizationUnitBannerProps {
  reportingPeriodId: number | undefined;
  locale: string | undefined;
  organizationUnitEmissionResults: EmissionResultsByOrganizationUnit;
}

export function OrganizationUnitBanner({
  reportingPeriodId,
  locale,
  organizationUnitEmissionResults,
}: OrganizationUnitBannerProps) {
  const { t } = useTranslation();

  const emissionsDataArray = useMemo<
    EmissionCategoryTotalByEmissionType[][]
  >(() => {
    if (organizationUnitEmissionResults) {
      return [
        calculateOrganizationUnitTotalEmissionsByCategoryAndEmissionType(
          organizationUnitEmissionResults,
          'scope1',
        ),
        calculateOrganizationUnitTotalEmissionsByCategoryAndEmissionType(
          organizationUnitEmissionResults,
          'scope2',
        ),
        calculateOrganizationUnitTotalEmissionsByCategoryAndEmissionType(
          organizationUnitEmissionResults,
          'scope3',
        ),
      ];
    }
    return [];
  }, [organizationUnitEmissionResults]);

  const totalOrganizationUnitGHGEmissions = useMemo<number>(() => {
    if (organizationUnitEmissionResults) {
      return calculateTotalGHGEmissionsOfOrganizationUnit(
        organizationUnitEmissionResults,
      );
    }
    return 0;
  }, [organizationUnitEmissionResults]);

  if (reportingPeriodId === undefined || locale === undefined) return null;
  return totalOrganizationUnitGHGEmissions ? (
    <Accordion type="single" collapsible>
      <AccordionItem
        value={`banner-item-${organizationUnitEmissionResults.id}`}
      >
        <div className="flex h-full items-stretch">
          <div className="hidden min-h-[88px] w-[240px] items-center self-stretch rounded-[2px] bg-banner-primary px-5 py-4 text-banner-primary-foreground sm:flex">
            <span className="break-normal">
              {organizationUnitEmissionResults.name}
            </span>
          </div>
          <div className="flex min-h-[88px] w-full max-w-[1264px] flex-wrap items-center justify-between gap-4 rounded-[2px] bg-banner-secondary px-5 py-4 text-emission-foreground">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
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

              <span className="ml-auto break-normal sm:hidden ">
                {organizationUnitEmissionResults.name}
              </span>
            </div>

            <div className="ml-auto flex flex-col">
              <div className="ml-auto flex gap-2">
                <span
                  className={cn('text-2xl font-bold ', {
                    'text-emission-foreground-muted':
                      totalOrganizationUnitGHGEmissions === 0,
                  })}
                >
                  {kgsToTons(totalOrganizationUnitGHGEmissions).toFixed(2)}
                </span>
                <span className="flex items-end text-xs">
                  <span className="pb-1">
                    <Trans i18nKey="dashboard.form.emissionsSummary.tCO2e" />
                  </span>
                </span>
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
                    disabled={totalOrganizationUnitGHGEmissions === 0}
                  >
                    <span className="pr-2">
                      {t('results.ghgEmissionsOfEachUnit.showDetails')}
                    </span>
                    <Icons.ArrowsDownSmall className="h-2 w-2" />
                  </Button>
                </AccordionTrigger>
              </div>
            </div>
          </div>
        </div>
        <AccordionContent className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          {totalOrganizationUnitGHGEmissions !== 0 && (
            <div className="mt-[2px] flex h-fit w-full flex-row flex-wrap gap-2 rounded-[2px] border-[0.5px] border-banner-border px-2 py-8 sm:px-8 lg:flex-nowrap">
              <div className="w-full max-w-2xl">
                <OrganizationUnitEmissionsByScopeTable
                  organizationUnitId={organizationUnitEmissionResults.id}
                  emissionsDataArray={emissionsDataArray}
                  totalOrganizationUnitGHGEmissions={
                    totalOrganizationUnitGHGEmissions
                  }
                />
              </div>
              <div className="hidden w-full basis-full md:flex md:basis-auto">
                <OrganizationUnitEmissionCategoriesLollipopChart
                  heightSizeType="fit-content"
                  emissionsDataArray={emissionsDataArray}
                />
              </div>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ) : null;
}
