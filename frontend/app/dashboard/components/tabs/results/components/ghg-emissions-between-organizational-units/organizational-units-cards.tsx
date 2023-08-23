'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { OrganizationalUnitCard } from './organization-unit-card';

import {
  getNormalizedOrganizationUnitsTotalEmissions,
  getNormalizedOrganizationUnitsTotalEmissionsWithADivider,
} from '@/lib/data/organizations-utils';
import {
  NormalizedOrganizationUnitWithTotalGHGEmissions,
  OrganizationUnitWithTotalGHGEmissions,
  OrganizationUnitWithTotalGHGEmissionsAndDivider,
} from '@/types/organization-unit';

type OrganizationalUnitsCardsPropsVsDivider = {
  totalGHGEmissionsPerOrganizationUnit?: never;
  organizationUnitsTotalEmissionsAndDividers: OrganizationUnitWithTotalGHGEmissionsAndDivider[];
};

type OrganizationalUnitsCardsPropsVsAllEmissions = {
  totalGHGEmissionsPerOrganizationUnit: OrganizationUnitWithTotalGHGEmissions[];
  organizationUnitsTotalEmissionsAndDividers?: never;
};

type OrganizationalUnitsCardsProps =
  | OrganizationalUnitsCardsPropsVsDivider
  | OrganizationalUnitsCardsPropsVsAllEmissions;

export function OrganizationalUnitsCards({
  totalGHGEmissionsPerOrganizationUnit,
  organizationUnitsTotalEmissionsAndDividers,
}: OrganizationalUnitsCardsProps) {
  const { t } = useTranslation();

  const normalizedOrganizationUnitsTotalEmissionsAndDividers = useMemo(() => {
    if (organizationUnitsTotalEmissionsAndDividers !== undefined) {
      return getNormalizedOrganizationUnitsTotalEmissionsWithADivider(
        organizationUnitsTotalEmissionsAndDividers,
      );
    }
    return [];
  }, [organizationUnitsTotalEmissionsAndDividers]);

  const normalizedTotalGHGEmissionsPerOrganizationUnit = useMemo(() => {
    if (totalGHGEmissionsPerOrganizationUnit !== undefined) {
      return getNormalizedOrganizationUnitsTotalEmissions(
        totalGHGEmissionsPerOrganizationUnit,
      );
    }
    return {} as {
      normalizedOrgUnitsWithTotalEmissions: NormalizedOrganizationUnitWithTotalGHGEmissions[];
      totalGHGEmissionsAllUnits: number;
    };
  }, [totalGHGEmissionsPerOrganizationUnit]);

  return (
    <div className="flex flex-wrap gap-6 items-center">
      {organizationUnitsTotalEmissionsAndDividers !== undefined &&
        normalizedOrganizationUnitsTotalEmissionsAndDividers.map(
          (normalizedOrgUnit) => (
            <OrganizationalUnitCard
              key={`org-unit-card-${normalizedOrgUnit.id}`}
              title={normalizedOrgUnit.name}
              primaryLabel={t(
                'results.ghgEmissionsBetweenUnits.totalEmissions',
              )}
              primaryValue={normalizedOrgUnit.totalGHGEmissions}
              primaryValueNormalized={
                normalizedOrgUnit.totalGHGEmissionsNormalized
              }
              secondaryLabel={t(
                'results.ghgEmissionsBetweenUnits.unitEmissions',
              )}
              secondaryLabelUnit={normalizedOrgUnit.organizationDivider.label}
              secondaryValue={
                normalizedOrgUnit.organizationDivider
                  .totalGHGEmissionsPerDivider
              }
              secondaryValueNormalized={
                normalizedOrgUnit.organizationDivider
                  .totalGHGEmissionsPerDividerNormalized
              }
            />
          ),
        )}
      {totalGHGEmissionsPerOrganizationUnit !== undefined &&
        normalizedTotalGHGEmissionsPerOrganizationUnit &&
        normalizedTotalGHGEmissionsPerOrganizationUnit.normalizedOrgUnitsWithTotalEmissions.map(
          (normalizedTotalGHGEmissionsPerOrgUnit) =>
            normalizedTotalGHGEmissionsPerOrgUnit.totalGHGEmissions > 0 ? (
              <OrganizationalUnitCard
                key={`org-unit-card-${normalizedTotalGHGEmissionsPerOrgUnit.id}`}
                title={normalizedTotalGHGEmissionsPerOrgUnit.name}
                primaryLabel={t(
                  'results.ghgEmissionsBetweenUnits.totalEmissions',
                )}
                primaryValue={
                  normalizedTotalGHGEmissionsPerOrganizationUnit.totalGHGEmissionsAllUnits
                }
                primaryValueNormalized={
                  normalizedTotalGHGEmissionsPerOrganizationUnit.totalGHGEmissionsAllUnits !==
                  0
                    ? 1
                    : 0
                }
                secondaryLabel={t(
                  'results.ghgEmissionsBetweenUnits.unitEmissions',
                )}
                secondaryValue={
                  normalizedTotalGHGEmissionsPerOrgUnit.totalGHGEmissions
                }
                secondaryValueNormalized={
                  normalizedTotalGHGEmissionsPerOrgUnit.totalGHGEmissionsNormalized
                }
              />
            ) : null,
        )}
    </div>
  );
}
