'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import EmissionsForm from '../emission-form/emissions-form';
import EmissionsEntriesTable from './emission-entries-table';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons/icons';
import { divideEntriesByOrgUnit } from '@/lib/data/utils';
import { useGetEmissionCategoryWithLocalizationsQuery } from '@/redux/api/emission-categories/emissionCategoriesApiSlice';
import { useGetEmissionEntriesByReportingPeriodQuery } from '@/redux/api/emission-entries/emissionEntriesApiSlice';
import { EmissionCategoryFlattenWithSourceGroups } from '@/types/emission-category';

interface EmissionsEntriesContainerProps {
  emissionCategoryId: number;
  reportingPeriodId: number;
  organizationId: number;
  locale: string;
  emissionCategoryWithFactors: EmissionCategoryFlattenWithSourceGroups;
}

export default function EmissionsEntriesContainer({
  emissionCategoryId,
  reportingPeriodId,
  organizationId,
  locale,
  emissionCategoryWithFactors,
}: EmissionsEntriesContainerProps) {
  const { t } = useTranslation();
  const emissionEntries =
    useGetEmissionEntriesByReportingPeriodQuery(reportingPeriodId);
  const emissionCategoryWithLocalizations =
    useGetEmissionCategoryWithLocalizationsQuery(emissionCategoryId, {
      skip: locale === (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as string),
    });

  let originalEmissionCategoryId: null | number = null;
  if (
    locale.toLocaleLowerCase() !==
      (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as string) &&
    emissionCategoryWithLocalizations.currentData
  ) {
    originalEmissionCategoryId =
      emissionCategoryWithLocalizations.currentData?.attributes.localizations.data.find(
        (emissionCategory) =>
          emissionCategory.attributes.locale ===
          (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as string),
      )?.id ?? null;
  }

  const dividedEmissionEntries = divideEntriesByOrgUnit(
    emissionEntries.currentData,
    originalEmissionCategoryId !== null
      ? originalEmissionCategoryId
      : emissionCategoryId,
  );

  const [isAddingNewEmissionOpen, setIsAddingNewEmissionOpen] = useState(false);

  const [
    latestSelectedOrganizationUnitId,
    setLatestSelectedOrganizationUnitId,
  ] = useState<number | null>(null);

  const handleOrganizationUnitChange = (organizationId: number) => {
    setLatestSelectedOrganizationUnitId(organizationId);
  };

  return (
    <div className="flex flex-col">
      {dividedEmissionEntries !== null &&
      emissionEntries.currentData &&
      !emissionCategoryWithLocalizations.isLoading &&
      Object.values(dividedEmissionEntries).length === 0 ? (
        <EmissionsForm
          reportingPeriodId={reportingPeriodId}
          organizationId={organizationId}
          formType="create"
          emissionCategoryWithFactors={emissionCategoryWithFactors}
          preSelectedOrganizationUnitId={latestSelectedOrganizationUnitId}
          onOrganizationUnitChange={handleOrganizationUnitChange}
          onApiSubmitSucess={() =>
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }
          onApiSubmitError={() => {}}
          onCancel={() => {}}
        />
      ) : (
        dividedEmissionEntries !== null && (
          <>
            <Accordion type="single" collapsible className="mt-10">
              {Object.values(dividedEmissionEntries).map((unit) => (
                <AccordionItem
                  key={unit.organizationUnit.id}
                  value={`item-${unit.organizationUnit.id}`}
                >
                  <AccordionTrigger className="px-2 text-sm text-text-regular-lighten">
                    {unit.organizationUnit.attributes.name}
                  </AccordionTrigger>
                  <AccordionContent className="px-2">
                    <EmissionsEntriesTable
                      emissionEntries={unit.emissionEntries}
                      reportingPeriodId={reportingPeriodId}
                      organizationId={organizationId}
                      emissionCategoryWithFactors={emissionCategoryWithFactors}
                      onOrganizationUnitChange={handleOrganizationUnitChange}
                    />
                    <div className="pt-8" />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <Button
              variant="icon"
              size="fit"
              type="button"
              className="ml-auto mt-12 text-primary"
              onClick={() => setIsAddingNewEmissionOpen(true)}
            >
              <span className="pr-2 text-lg font-bold">
                {t('dashboard.form.emissionEntry.addNewCategoryEmissions', {
                  categoryTitle:
                    originalEmissionCategoryId !== null
                      ? emissionCategoryWithLocalizations.currentData?.attributes?.title.toLocaleLowerCase()
                      : emissionCategoryWithFactors.title.toLocaleLowerCase(),
                })}
              </span>
              <Icons.Union />
            </Button>

            {isAddingNewEmissionOpen && (
              <div className="mt-12">
                <EmissionsForm
                  reportingPeriodId={reportingPeriodId}
                  organizationId={organizationId}
                  formType="create"
                  emissionCategoryWithFactors={emissionCategoryWithFactors}
                  preSelectedOrganizationUnitId={
                    latestSelectedOrganizationUnitId
                  }
                  onOrganizationUnitChange={handleOrganizationUnitChange}
                  onApiSubmitSucess={() => setIsAddingNewEmissionOpen(false)}
                  onApiSubmitError={() => {}}
                  onCancel={() => setIsAddingNewEmissionOpen(false)}
                  scrollIntoView
                />
              </div>
            )}
          </>
        )
      )}
    </div>
  );
}
