'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import EmissionsForm from '../emission-form/emissions-form';
import EmissionsEntry from './emission-entry';

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
                  <AccordionTrigger className="text-text-regular-lighten text-sm px-2">
                    {unit.organizationUnit.attributes.name}
                  </AccordionTrigger>
                  <AccordionContent className="px-2">
                    {unit.emissionEntries.map((emissionEntry) => (
                        <EmissionsEntry
                          key={`emissionEntryItem-${emissionEntry.id}`}
                          reportingPeriodId={reportingPeriodId}
                          organizationId={organizationId}
                          emissionCategoryWithFactors={
                            emissionCategoryWithFactors
                          }
                          emissionEntry={emissionEntry}
                        />
                      ))}
                    <div className="pt-8" />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <Button
              variant="icon"
              size="fit"
              type="button"
              className="text-primary mt-12 ml-auto"
              onClick={() => setIsAddingNewEmissionOpen(true)}
            >
              <span className="text-lg font-bold pr-2">
                {t('dashboard.form.emissionEntry.addNewCategoryEmissions', {
                  categoryTitle:
                    emissionCategoryWithLocalizations.currentData?.attributes
                      .title,
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
                  onApiSubmitSucess={() => setIsAddingNewEmissionOpen(false)}
                  onApiSubmitError={() => {}}
                  onCancel={() => setIsAddingNewEmissionOpen(false)}
                />
              </div>
            )}
          </>
        )
      )}
    </div>
  );
}
