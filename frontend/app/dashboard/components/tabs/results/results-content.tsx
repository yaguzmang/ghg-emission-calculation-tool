'use client';

import { useTranslation } from 'react-i18next';

import { EmissionCategoriesLollipopChart } from './components/emission-categories-lollipop-chart';
import { GHGEmissionsBetweenOrganizationalUnitsContainer } from './components/ghg-emissions-between-organizational-units/organizational-units-container';
import { GHGEmissionsByCategoryAndOrganizationUnitContainer } from './components/ghg-emissions-by-category-and-organization-unit/ghg-emissions-by-category-and-organization-unit-container copy';
import { OrganizationUnitBannerContainer } from './components/ghg-emissions-of-each-organization-unit/organization-unit-banner-container';

import EmissionsByScopeTable from '@/components/emission-results/emissions-by-scope-table';
import { EmissionsSummaryPanel } from '@/components/emissions-summary-panel/emissions-summary-panel';
import { OrganizationPeriodFormAccordion } from '@/components/organization-period-form/organization-period-form-accordion';
import { Button } from '@/components/ui/button';
import {
  ArrowReadMore,
  Popover,
  PopoverContentReadMore,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  useSelectedLocale,
  useSelectedOrganizationId,
  useSelectedReportingPeriodId,
} from '@/redux/store/ui/shared';

export function ResultsTabContent() {
  const { t } = useTranslation();
  const selectedLocale = useSelectedLocale();
  const selectedeportingPeriodId = useSelectedReportingPeriodId('results');
  const selectedOrganizationId = useSelectedOrganizationId('results');
  return (
    <div className="h-full w-full flex-1 gap-12 px-2 py-8 pb-48 sm:px-8">
      <div className="flex flex-col gap-12">
        <div className="flex flex-wrap justify-between gap-8 ">
          <OrganizationPeriodFormAccordion section="results" />
          <EmissionsSummaryPanel
            reportingPeriodId={selectedeportingPeriodId}
            locale={selectedLocale}
            includeAccuracy
          />
          <div className="ml-auto mt-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="link" size="fit" type="button">
                  {t('results.accuracy.readMore')}
                </Button>
              </PopoverTrigger>
              <PopoverContentReadMore side="bottom" sideOffset={12}>
                <p>{t('results.accuracy.readMore.content')}</p>
                <ArrowReadMore />
              </PopoverContentReadMore>
            </Popover>
          </div>
        </div>
        {selectedeportingPeriodId && selectedLocale && (
          <div className="flex h-fit w-full flex-row flex-wrap gap-2 rounded-[2px] border border-primary px-2 py-8 sm:px-8 lg:flex-nowrap">
            <div className="w-full max-w-2xl">
              <EmissionsByScopeTable
                reportingPeriodId={selectedeportingPeriodId}
                locale={selectedLocale}
              />
            </div>
            <div className="hidden w-full basis-full md:flex md:basis-auto">
              <EmissionCategoriesLollipopChart heightSizeType="fit-content" />
            </div>
          </div>
        )}
        <GHGEmissionsBetweenOrganizationalUnitsContainer
          organizationId={selectedOrganizationId}
          reportingPeriodId={selectedeportingPeriodId}
          locale={selectedLocale}
        />
        {selectedLocale && selectedLocale && (
          <OrganizationUnitBannerContainer
            reportingPeriodId={selectedeportingPeriodId}
            locale={selectedLocale}
          />
        )}
        {selectedLocale && selectedeportingPeriodId && (
          <GHGEmissionsByCategoryAndOrganizationUnitContainer
            reportingPeriodId={selectedeportingPeriodId}
            locale={selectedLocale}
          />
        )}
      </div>
    </div>
  );
}
