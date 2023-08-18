import { EmissionResults } from '@/types/emission-result';
import { OrganizationDivider } from '@/types/organization-divider';
import {
  NormalizedOrganizationUnitWithTotalGHGEmissions,
  NormalizedOrganizationUnitWithTotalGHGEmissionsAndDivider,
  OrganizationUnitWithDividerValues,
  OrganizationUnitWithTotalGHGEmissions,
  OrganizationUnitWithTotalGHGEmissionsAndDivider,
} from '@/types/organization-unit';

export function getUsedDividerValuesFromOrganizationUnits(
  organizationUnitsWithDividerValues: OrganizationUnitWithDividerValues[],
): OrganizationDivider[] {
  const usedOrganizationDivider: OrganizationDivider[] = [];
  const addedOrganizationDividerIds = new Set<number>();

  organizationUnitsWithDividerValues.forEach((organizationUnit) => {
    const {dividerValues} = organizationUnit.attributes;
    dividerValues.forEach((dividerValue) => {
      if (dividerValue.organizationDivider.data === null) return;
      if (
        addedOrganizationDividerIds.has(
          dividerValue.organizationDivider.data.id,
        )
      )
        return;
      usedOrganizationDivider.push(dividerValue.organizationDivider.data);
      addedOrganizationDividerIds.add(dividerValue.organizationDivider.data.id);
    });
  });

  return usedOrganizationDivider;
}

export function calculateTotalGHGEmissionsPerOrganizationUnit(
  data: EmissionResults,
): OrganizationUnitWithTotalGHGEmissions[] {
  return data.organizationUnits.map((orgUnit) => {
    const scope1Emissions = orgUnit.emissions.scope1.reduce(
      (acc, category) => acc + category.emissions,
      0,
    );

    const scope2Emissions = orgUnit.emissions.scope2.reduce(
      (acc, category) => acc + category.emissions,
      0,
    );

    const scope3Emissions = orgUnit.emissions.scope3.reduce(
      (acc, category) => acc + category.emissions,
      0,
    );

    const totalGHGEmissions =
      scope1Emissions + scope2Emissions + scope3Emissions;

    return {
      id: orgUnit.id,
      name: orgUnit.name,
      totalGHGEmissions,
    };
  });
}

export function getOrganizationUnitsTotalEmissionsWithADivider(
  totalGHGEmissionsPerOrgUnit: OrganizationUnitWithTotalGHGEmissions[],
  organizationUnitsWithDividerValues: OrganizationUnitWithDividerValues[],
  organizationDividerId: number,
): OrganizationUnitWithTotalGHGEmissionsAndDivider[] {
  const orgUnitsTotalEmissionsAndDivider: OrganizationUnitWithTotalGHGEmissionsAndDivider[] =
    [];
  totalGHGEmissionsPerOrgUnit.forEach((orgUnitWithTotalGHGEmissions) => {
    // To avoid 'possibly undefined warnings'
    if (organizationUnitsWithDividerValues === undefined) return;
    if (orgUnitWithTotalGHGEmissions.totalGHGEmissions <= 0) return;

    const orgUnitWithDividers = organizationUnitsWithDividerValues.find(
      (organizationUnit) =>
        organizationUnit.id === orgUnitWithTotalGHGEmissions.id,
    );
    if (orgUnitWithDividers === undefined) return;
    const divider = orgUnitWithDividers.attributes.dividerValues.find(
      (dividerValue) =>
        dividerValue.organizationDivider.data?.id === organizationDividerId,
    );
    if (!divider) return;
    if (!divider.organizationDivider.data) return;

    orgUnitsTotalEmissionsAndDivider.push({
      ...orgUnitWithTotalGHGEmissions,
      organizationDivider: {
        id: divider.organizationDivider.data.id,
        label: divider.organizationDivider.data.attributes.label,
        value: divider.value,
      },
    });
  });
  return orgUnitsTotalEmissionsAndDivider;
}

export function getNormalizedOrganizationUnitsTotalEmissionsWithADivider(
  organizationUnitsTotalEmissionsAndDivider: OrganizationUnitWithTotalGHGEmissionsAndDivider[],
): NormalizedOrganizationUnitWithTotalGHGEmissionsAndDivider[] {
  const normalizedOrgUnitsTotalEmissionsAndDivider: NormalizedOrganizationUnitWithTotalGHGEmissionsAndDivider[] =
    [];
  const maxTotalGHGEmissions = Math.max(
    ...organizationUnitsTotalEmissionsAndDivider.map(
      (item) => item.totalGHGEmissions,
    ),
  );

  organizationUnitsTotalEmissionsAndDivider.forEach((orgUnit) => {
    const totalGHGEmissionsNormalized =
      maxTotalGHGEmissions !== 0
        ? orgUnit.totalGHGEmissions / maxTotalGHGEmissions
        : 0;

    const totalGHGEmissionsPerDivider =
      orgUnit.organizationDivider.value !== 0
        ? orgUnit.totalGHGEmissions / orgUnit.organizationDivider.value
        : 0;

    const totalGHGEmissionsPerDividerNormalized =
      orgUnit.totalGHGEmissions !== 0
        ? totalGHGEmissionsPerDivider / orgUnit.totalGHGEmissions
        : 0;

    const normalizedItem: NormalizedOrganizationUnitWithTotalGHGEmissionsAndDivider =
      {
        ...orgUnit,
        totalGHGEmissionsNormalized,
        organizationDivider: {
          ...orgUnit.organizationDivider,
          totalGHGEmissionsPerDivider,
          totalGHGEmissionsPerDividerNormalized,
        },
      };
    normalizedOrgUnitsTotalEmissionsAndDivider.push(normalizedItem);
  });

  return normalizedOrgUnitsTotalEmissionsAndDivider;
}

export function getNormalizedOrganizationUnitsTotalEmissions(
  organizationUnits: OrganizationUnitWithTotalGHGEmissions[],
): {
  normalizedOrgUnitsWithTotalEmissions: NormalizedOrganizationUnitWithTotalGHGEmissions[];
  totalGHGEmissionsAllUnits: number;
} {
  const normalizedOrgUnits: NormalizedOrganizationUnitWithTotalGHGEmissions[] =
    [];

  let totalGHGEmissionsSum = 0;

  organizationUnits.forEach((orgUnit) => {
    totalGHGEmissionsSum += orgUnit.totalGHGEmissions;
  });

  organizationUnits.forEach((orgUnit) => {
    const totalGHGEmissionsNormalized =
      totalGHGEmissionsSum !== 0
        ? orgUnit.totalGHGEmissions / totalGHGEmissionsSum
        : 0;

    const normalizedItem: NormalizedOrganizationUnitWithTotalGHGEmissions = {
      ...orgUnit,
      totalGHGEmissionsNormalized,
    };

    normalizedOrgUnits.push(normalizedItem);
  });

  return {
    normalizedOrgUnitsWithTotalEmissions: normalizedOrgUnits,
    totalGHGEmissionsAllUnits: totalGHGEmissionsSum,
  };
}
