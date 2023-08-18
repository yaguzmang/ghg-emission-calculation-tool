'use client';

import { EmissionCategoriesLollipopChart } from './components/emission-categories-lollipop-chart';
import { GHGEmissionsBetweenOrganizationalUnitsContainer } from './components/ghg-emissions-between-organizational-units/organizational-units-container';

import EmissionsByScopeTable from '@/components/emission-results/emissions-by-scope-table';
import { EmissionsSummaryPanel } from '@/components/emissions-summary-panel/emissions-summary-panel';
import { OrganizationPeriodForm } from '@/components/organization-period-form/organization-period-form';
import {
  useSelectedLocale,
  useSelectedOrganizationId,
  useSelectedReportingPeriodId,
} from '@/redux/store/ui/shared';

export function ResultsTabContent() {
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
      </div>
    </div>
  );
}
