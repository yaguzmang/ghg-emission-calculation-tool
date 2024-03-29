'use client';

import React, { useState } from 'react';

import { nanoid } from 'nanoid';

import { DeletePeriodButton } from './components/delete-period-button';
import { EmissionCategoryCard } from './components/emission-category-card';
import { ExportEmissionsButton } from './components/export-emissions-button';
// import { ImportEmissionsButton } from './components/import-emissions-button';
import { ImportOrganizationUnitsFileMapper } from './components/import-org-units-mapper/import-org-units-mapper-container';

import { EmissionsSummaryPanel } from '@/components/emissions-summary-panel/emissions-summary-panel';
import { OrganizationPeriodFormAccordion } from '@/components/organization-period-form/organization-period-form-accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { UserWalkthrough } from '@/components/user-walkthrough/user-walkthrough';
import { useGetDashboardEmissionCategoriesByLocaleQuery } from '@/redux/api/settings/dashboardSettingsApiSlice';
import {
  useSelectedLocale,
  useSelectedReportingPeriodId,
} from '@/redux/store/ui/shared';
import { UserWalkthroughStep } from '@/redux/store/ui/shared/stateType';

export function FormTabContent() {
  const selectedLocale = useSelectedLocale();
  const selectedeportingPeriodId = useSelectedReportingPeriodId('form');

  const {
    data: dashboardEmissionCategories,
    isLoading: isEmissionCategoriesLoading,
    isFetching: isEmissionCategoriesFetching,
  } = useGetDashboardEmissionCategoriesByLocaleQuery(
    selectedLocale ?? (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as string),
  );

  const [file, setFile] = useState<File | null>(null);

  const handleImportFileSelected = (file: File | null) => {
    setFile(file);
  };

  return (
    <div className="h-full w-full flex-1 px-2 py-8 sm:px-8">
      <div className="flex w-full flex-wrap justify-between gap-8">
        <OrganizationPeriodFormAccordion section="form" />
        <div className="flex w-full flex-wrap gap-5">
          {/* {selectedeportingPeriodId !== undefined && (
            <ImportEmissionsButton
              onImportFileSelected={handleImportFileSelected}
              reportingPeriodId={selectedeportingPeriodId}
            />
          )} */}
          {selectedeportingPeriodId !== undefined && (
            <ExportEmissionsButton
              reportingPeriodId={selectedeportingPeriodId}
            />
          )}
          {selectedeportingPeriodId !== undefined && (
            <div className="md:ml-auto">
              <DeletePeriodButton
                reportingPeriodId={selectedeportingPeriodId}
              />
            </div>
          )}
        </div>
        {selectedeportingPeriodId !== undefined && file !== null && (
          <ImportOrganizationUnitsFileMapper
            reportingPeriodId={selectedeportingPeriodId}
            onChangeFile={handleImportFileSelected}
            file={file}
          />
        )}
        <EmissionsSummaryPanel
          reportingPeriodId={selectedeportingPeriodId}
          locale={selectedLocale}
          includeAccuracy={false}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4">
        {dashboardEmissionCategories === undefined ||
        isEmissionCategoriesLoading ||
        isEmissionCategoriesFetching
          ? Array(18)
              .fill(null)
              .map(() => (
                <Skeleton
                  key={nanoid()}
                  className="inline-block h-[136px] w-[400px]"
                />
              ))
          : dashboardEmissionCategories?.map((emissionCategory, index) => (
              <React.Fragment key={emissionCategory.id}>
                {index === 0 ? (
                  <UserWalkthrough
                    isButton
                    className="w-full max-w-[400px]"
                    step={UserWalkthroughStep.selectAFormCategory}
                  >
                    <EmissionCategoryCard
                      key={emissionCategory.id}
                      emissionCategory={emissionCategory}
                    />
                  </UserWalkthrough>
                ) : (
                  <EmissionCategoryCard
                    key={emissionCategory.id}
                    emissionCategory={emissionCategory}
                  />
                )}
              </React.Fragment>
            ))}
      </div>
    </div>
  );
}
