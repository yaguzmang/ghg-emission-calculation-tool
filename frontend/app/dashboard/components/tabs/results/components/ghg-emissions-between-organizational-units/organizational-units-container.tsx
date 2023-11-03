'use client';

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { GHGEmissionsBetweenOrganizationalUnits } from './organizational-units';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { getUsedDividerValuesFromOrganizationUnits } from '@/lib/data/organizations-utils';
import { useGetOrganizationUnitsWithDividerValuesByOrganizationQuery } from '@/redux/api/organization-units/organizationUnitsApiSlice';
import { OrganizationDivider } from '@/types/organization-divider';

interface GHGEmissionsBetweenOrganizationalUnitsContainerProps {
  organizationId: number | undefined;
  reportingPeriodId: number | undefined;
  locale: string | undefined;
}

export function GHGEmissionsBetweenOrganizationalUnitsContainer({
  organizationId,
  reportingPeriodId,
  locale,
}: GHGEmissionsBetweenOrganizationalUnitsContainerProps) {
  const { t } = useTranslation();

  const organizationUnitsWithDividerValues =
    useGetOrganizationUnitsWithDividerValuesByOrganizationQuery(
      organizationId ?? 0,
      { skip: organizationId === undefined },
    );

  const [selectedOrganizationDividerId, setSelectedOrganizationDividerId] =
    useState<number | null>(null);

  const usedOrganizationDividers = useMemo<OrganizationDivider[]>(() => {
    const usedDividers = getUsedDividerValuesFromOrganizationUnits(
      organizationUnitsWithDividerValues.currentData ?? [],
    );
    if (usedDividers.length > 0) {
      setSelectedOrganizationDividerId(usedDividers[0].id);
    } else {
      setSelectedOrganizationDividerId(0);
    }
    return usedDividers;
  }, [organizationUnitsWithDividerValues.currentData]);

  return (
    <div>
      <div className="flex w-full flex-wrap items-center justify-between gap-y-8 bg-background px-2 py-8 shadow-md sm:px-8">
        <div className="max-w-[470px]">
          <h2 className="break-normal">
            {t('results.ghgEmissionsBetweenUnits')}
          </h2>
        </div>
        <div>
          <ToggleGroup
            type="single"
            onValueChange={(selectedValue: string) => {
              if (selectedValue === '') return;
              const selectedValueParsed = parseInt(selectedValue, 10);
              setSelectedOrganizationDividerId(selectedValueParsed);
            }}
            value={
              selectedOrganizationDividerId !== null
                ? selectedOrganizationDividerId.toString()
                : undefined
            }
            className="flex flex-col items-end gap-2"
          >
            {usedOrganizationDividers.map((organizationDivider) => (
              <ToggleGroupItem
                key={organizationDivider.id}
                value={organizationDivider.id.toString()}
                className="h-fit w-fit text-base"
              >
                <span className="px-1 leading-tight">
                  {t(
                    'results.ghgEmissionsBetweenUnits.GHGEmissionsVsOrganizationDivider',
                    {
                      OrganizationDividerLabel:
                        organizationDivider.attributes.label,
                    },
                  )}
                </span>
              </ToggleGroupItem>
            ))}
            <ToggleGroupItem
              key="all-GHG-emission-vs-unit-emissions"
              value="0"
              className="h-fit w-fit text-base"
            >
              <span className="px-1 leading-tight">
                {t(
                  'results.ghgEmissionsBetweenUnits.allGHGEmissionsVsUnitEmissions',
                )}
              </span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      {selectedOrganizationDividerId !== null && (
        <GHGEmissionsBetweenOrganizationalUnits
          organizationId={organizationId}
          reportingPeriodId={reportingPeriodId}
          locale={locale}
          organizationDividerId={selectedOrganizationDividerId}
        />
      )}
    </div>
  );
}
