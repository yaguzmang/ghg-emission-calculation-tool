'use client';

import { useTranslation } from 'react-i18next';

import { EmissionCategoriesLollipopChart } from './components/emission-categories-lollipop-chart';
import { GHGEmissionsBetweenOrganizationalUnitsContainer } from './components/ghg-emissions-between-organizational-units/organizational-units-container';
import { OrganizationUnitBannerContainer } from './components/ghg-emissions-of-each-organization-unit/organization-unit-banner-container';

import EmissionsByScopeTable from '@/components/emission-results/emissions-by-scope-table';
import { EmissionsSummaryPanel } from '@/components/emissions-summary-panel/emissions-summary-panel';
import { OrganizationPeriodForm } from '@/components/organization-period-form/organization-period-form';
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
    <div className="h-full w-full flex-1 py-8 px-2 sm:px-8 gap-12">
      <div className="flex flex-col gap-12">
        <div className="flex flex-wrap justify-between gap-8 ">
          <OrganizationPeriodForm section="results" />
          <EmissionsSummaryPanel
            reportingPeriodId={selectedeportingPeriodId}
            locale={selectedLocale}
            includeAccuracy
          />
          <div className="ml-auto -mt-4">
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
          <div className="border border-primary rounded-[2px] px-2 py-8 sm:px-8 w-full h-fit flex flex-row flex-wrap md:flex-nowrap gap-2">
            <div className="max-w-2xl w-full">
              <EmissionsByScopeTable
                reportingPeriodId={selectedeportingPeriodId}
                locale={selectedLocale}
              />
            </div>
            <div className="w-full basis-full md:basis-auto">
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
      </div>
    </div>
  );
}