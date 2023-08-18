'use client';

import { useMemo } from 'react';

import { OrganizationalUnitsCards } from './organizational-units-cards';

import {
  calculateTotalGHGEmissionsPerOrganizationUnit,
  getOrganizationUnitsTotalEmissionsWithADivider,
} from '@/lib/data/organizations-utils';
import { useGetEmissionsResultsByReportingPeriodQuery } from '@/redux/api/emission-results/emissionResultsApiSlice';
import { useGetOrganizationUnitsWithDividerValuesByOrganizationQuery } from '@/redux/api/organization-units/organizationUnitsApiSlice';
import {
  OrganizationUnitWithTotalGHGEmissions,
  OrganizationUnitWithTotalGHGEmissionsAndDivider,
} from '@/types/organization-unit';

interface GHGEmissionsBetweenOrganizationalUnitsProps {
  organizationId: number | undefined;
  reportingPeriodId: number | undefined;
  locale: string | undefined;
  organizationDividerId: number;
}

export function GHGEmissionsBetweenOrganizationalUnits({
  organizationId,
  reportingPeriodId,
  locale,
  organizationDividerId,
}: GHGEmissionsBetweenOrganizationalUnitsProps) {
  const emissionResults = useGetEmissionsResultsByReportingPeriodQuery(
    {
      reportingPeriodId: reportingPeriodId ?? -1,
      locale: locale ?? (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as string),
    },
    {
      skip: reportingPeriodId === undefined || locale === undefined,
    },
  );

  const organizationUnitsWithDividerValues =
    useGetOrganizationUnitsWithDividerValuesByOrganizationQuery(
      organizationId ?? 0,
      { skip: organizationId === undefined },
    );

  const totalGHGEmissionsPerOrgUnit = useMemo<
    OrganizationUnitWithTotalGHGEmissions[]
  >(() => {
    if (emissionResults.currentData === undefined) return [];
    return calculateTotalGHGEmissionsPerOrganizationUnit(
      emissionResults.currentData,
    );
  }, [emissionResults.currentData]);

  const organizationUnitsTotalEmissionsAndDividers = useMemo<
    OrganizationUnitWithTotalGHGEmissionsAndDivider[]
  >(() => {
    if (organizationDividerId === 0) return []; // 0 is reserved for All emissions vs Unit Emissions
    if (totalGHGEmissionsPerOrgUnit.length === 0) return [];
    if (organizationUnitsWithDividerValues.currentData === undefined) return [];
    const orgUnitsTotalEmissionsAndDivider =
      getOrganizationUnitsTotalEmissionsWithADivider(
        totalGHGEmissionsPerOrgUnit,
        organizationUnitsWithDividerValues.currentData,
        organizationDividerId,
      );
    return orgUnitsTotalEmissionsAndDivider;
  }, [
    totalGHGEmissionsPerOrgUnit,
    organizationUnitsWithDividerValues.currentData,
    organizationDividerId,
  ]);

  return (
    <div className="w-full px-0 sm:px-2 py-2">
      {organizationDividerId === 0 ? (
        <OrganizationalUnitsCards
          totalGHGEmissionsPerOrganizationUnit={totalGHGEmissionsPerOrgUnit}
        />
      ) : (
        <OrganizationalUnitsCards
          organizationUnitsTotalEmissionsAndDividers={
            organizationUnitsTotalEmissionsAndDividers
          }
        />
      )}
    </div>
  );
}
