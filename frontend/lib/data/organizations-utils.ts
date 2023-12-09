import {
  EmissionCategoryTotalByEmissionType,
  EmissionResults,
  EmissionResultsByOrganizationUnit,
  EmissionResultsPerReportinPeriodId,
} from '@/types/emission-result';
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
    const { dividerValues } = organizationUnit.attributes;
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

export function calculateTotalGHGEmissionsOfOrganizationUnit(
  orgUnit: EmissionResultsByOrganizationUnit,
): number {
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
  const totalGHGEmissions = scope1Emissions + scope2Emissions + scope3Emissions;

  return totalGHGEmissions;
}
export function calculateTotalGHGEmissionsFromResult(
  totalEmissions: EmissionResults['totalEmissions'],
): number {
  const totalDirectEmissions = totalEmissions.scope1?.emissions ?? 0;
  const totalIndirectEmissions = totalEmissions.scope2?.emissions ?? 0;
  const totalValueChainEmissions = totalEmissions.scope3?.emissions ?? 0;

  const totalGHGEmissions =
    totalDirectEmissions + totalIndirectEmissions + totalValueChainEmissions;

  return totalGHGEmissions;
}

export function getHighestTotalEmissionsOfResultsByReportingPeriodId(
  emissionResultsById: EmissionResultsPerReportinPeriodId,
): number | null {
  const ids = Object.keys(emissionResultsById);

  if (ids.length === 0) {
    return null;
  }

  const highestTotalEmissions = ids.reduce((maxEmissions, currentId) => {
    const currentResults = emissionResultsById[currentId];

    if (currentResults !== 'loading' && currentResults !== 'error') {
      const currentTotalEmissions = calculateTotalGHGEmissionsFromResult(
        currentResults.totalEmissions,
      );

      return Math.max(maxEmissions, currentTotalEmissions);
    }

    return maxEmissions;
  }, 0);

  return highestTotalEmissions;
}

export function calculateTotalGHGEmissionsOfOrganizationUnitAndCategory(
  emissionResults: EmissionResults,
  organizationUnitId: number,
  emissionCategoryId: number,
): number {
  const organizationUnit = emissionResults.organizationUnits.find(
    (unit) => unit.id === organizationUnitId,
  );

  if (organizationUnit) {
    const categoryEmissions = [
      ...organizationUnit.emissions.scope1,
      ...organizationUnit.emissions.scope2,
      ...organizationUnit.emissions.scope3,
    ];

    const totalEmissions = categoryEmissions
      .filter((emission) => emission.id === emissionCategoryId)
      .reduce((sum, emission) => sum + emission.emissions, 0);

    return totalEmissions;
  }

  return 0;
}

export function calculateTotalGHGEmissionsOfCategoryInAllUnits(
  emissionResults: EmissionResults,
  emissionCategoryId: number,
): number {
  const totalEmissions = emissionResults.organizationUnits.reduce(
    (sum, unit) => {
      const categoryEmissions = [
        ...unit.emissions.scope1,
        ...unit.emissions.scope2,
        ...unit.emissions.scope3,
      ];

      const categoryTotal = categoryEmissions
        .filter((emission) => emission.id === emissionCategoryId)
        .reduce((categorySum, emission) => categorySum + emission.emissions, 0);

      return sum + categoryTotal;
    },
    0,
  );

  return totalEmissions;
}

export function calculateTotalGHGEmissionsPerOrganizationUnit(
  data: EmissionResults,
): OrganizationUnitWithTotalGHGEmissions[] {
  return data.organizationUnits.map((orgUnit) => {
    const totalGHGEmissions =
      calculateTotalGHGEmissionsOfOrganizationUnit(orgUnit);
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

export function calculateOrganizationUnitTotalEmissionsByCategoryAndEmissionType(
  organizationUnitEmissionResults: EmissionResultsByOrganizationUnit,
  emissionType: 'scope1' | 'scope2' | 'scope3' | 'biogenic',
): EmissionCategoryTotalByEmissionType[] {
  const emissionCategoriesTotalEmissionsByScope: EmissionCategoryTotalByEmissionType[] =
    [];

  const emissionCategories =
    organizationUnitEmissionResults.emissions[emissionType];
  emissionCategories.forEach((category) => {
    const existingCategory = emissionCategoriesTotalEmissionsByScope.find(
      (item) => item.id === category.id,
    );

    if (existingCategory) {
      existingCategory.totalEmissions += category.emissions;
    } else {
      const emissionCategoryTotal: EmissionCategoryTotalByEmissionType = {
        ...category,
        emissionType,
        totalEmissions: category.emissions,
      };
      emissionCategoriesTotalEmissionsByScope.push(emissionCategoryTotal);
    }
  });

  return emissionCategoriesTotalEmissionsByScope;
}

export function calculateTotalAllEmissionPerCategory(
  emissionsDataArray: EmissionCategoryTotalByEmissionType[][],
): EmissionCategoryTotalByEmissionType[] {
  const totalEmissionsPerCategory: EmissionCategoryTotalByEmissionType[] = [];
  const totalGHGEmissionsPerCategoryMap = new Map<
    number,
    EmissionCategoryTotalByEmissionType
  >();
  emissionsDataArray.forEach((emissionsData) => {
    emissionsData.forEach((category) => {
      let totalGHGEmissionsOfCategory = category.totalEmissions;
      if (totalGHGEmissionsPerCategoryMap.has(category.id)) {
        const existingCategory = totalGHGEmissionsPerCategoryMap.get(
          category.id,
        );
        totalGHGEmissionsOfCategory += existingCategory?.totalEmissions ?? 0;
      }
      const totalGHGEmissionsPerCategoryObject = {
        ...category,
        totalEmissions: totalGHGEmissionsOfCategory,
      };
      totalGHGEmissionsPerCategoryMap.set(
        category.id,
        totalGHGEmissionsPerCategoryObject,
      );
    });
  });
  totalGHGEmissionsPerCategoryMap.forEach((emissionCategory) => {
    totalEmissionsPerCategory.push(emissionCategory);
  });
  return totalEmissionsPerCategory;
}
