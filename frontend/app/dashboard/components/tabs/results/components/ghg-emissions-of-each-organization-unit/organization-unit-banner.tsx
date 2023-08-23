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
          <div className="hidden min-h-[88px] w-[240px] bg-banner-primary px-5 py-4 rounded-[2px] text-banner-primary-foreground sm:flex items-center self-stretch">
            <span className="break-normal">
              {organizationUnitEmissionResults.name}
            </span>
          </div>
          <div className="flex w-full max-w-[1264px] bg-banner-secondary text-emission-foreground min-h-[88px] justify-between px-5 py-4 rounded-[2px] items-center flex-wrap gap-4">
            <div className="flex flex-col">
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

              <span className="break-normal ml-auto sm:hidden ">
                {organizationUnitEmissionResults.name}
              </span>
            </div>

            <div className="flex flex-col ml-auto">
              <div className="flex gap-2 ml-auto">
                <span
                  className={cn('text-2xl font-bold ', {
                    'text-emission-foreground-muted':
                      totalOrganizationUnitGHGEmissions === 0,
                  })}
                >
                  {kgsToTons(totalOrganizationUnitGHGEmissions).toFixed(2)}
                </span>
                <span className="text-xs flex items-end">
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
            <div className="border-[0.5px] border-banner-border rounded-[2px] mt-[2px] w-full px-2 py-8 sm:px-8 h-fit flex flex-row flex-wrap lg:flex-nowrap gap-2">
              <div className="max-w-2xl w-full">
                <OrganizationUnitEmissionsByScopeTable
                  organizationUnitId={organizationUnitEmissionResults.id}
                  emissionsDataArray={emissionsDataArray}
                  totalOrganizationUnitGHGEmissions={
                    totalOrganizationUnitGHGEmissions
                  }
                />
              </div>
              <div className="w-full basis-full md:basis-auto hidden md:flex">
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
