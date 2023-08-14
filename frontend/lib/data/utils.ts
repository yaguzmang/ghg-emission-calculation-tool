import { EmissionCategoryFlattenWithSourceGroups } from '@/types/emission-category';
import { EmissionEntryWithOrganizationUnitAndEmissionSource } from '@/types/emission-entry';
import {
  EmissionCategoryTotalByEmissionType,
  EmissionResults,
  EmissionsTotalByCategory,
} from '@/types/emission-result';
import { OrganizationUnit } from '@/types/organization-unit';

export const findEmissionSourceById = (
  emissionCategoriesWithFactors: EmissionCategoryFlattenWithSourceGroups,
  id: number | null,
) => {
  if (id === null) return null;
  const emissionSources =
    emissionCategoriesWithFactors.emissionSourceGroups.flatMap(
      (emissionGroup) => emissionGroup.emissionSources,
    );
  return emissionSources.find((source) => source.id === id) || null;
};

export function getEmissionCategoryEntries(
  emissionEntries:
    | EmissionEntryWithOrganizationUnitAndEmissionSource[]
    | undefined,
  emissionCategoryId: number,
): EmissionEntryWithOrganizationUnitAndEmissionSource[] | null {
  if (emissionEntries === undefined) {
    return null;
  }

  const emissionEntriesOfCategory: EmissionEntryWithOrganizationUnitAndEmissionSource[] =
    [];
  emissionEntries.forEach(
    (entry: EmissionEntryWithOrganizationUnitAndEmissionSource) => {
      const emissionCategoryData =
        entry.attributes.emissionSource.data.attributes.emissionCategory.data;

      if (emissionCategoryData.id !== emissionCategoryId) {
        return;
      }
      emissionEntriesOfCategory.push(entry);
    },
  );

  return emissionEntriesOfCategory;
}

interface EmissionEntriesByOrganzationUnit {
  [organizationUnitId: string]: {
    organizationUnit: OrganizationUnit;
    emissionEntries: EmissionEntryWithOrganizationUnitAndEmissionSource[];
  };
}

export function divideEntriesByOrgUnit(
  inputObject: EmissionEntryWithOrganizationUnitAndEmissionSource[] | undefined,
  emissionCategoryId: number,
): EmissionEntriesByOrganzationUnit | null {
  if (inputObject === undefined) {
    return null;
  }
  const emissionEntriesByOrganizationUnit: EmissionEntriesByOrganzationUnit =
    {};

  inputObject.forEach(
    (entry: EmissionEntryWithOrganizationUnitAndEmissionSource) => {
      const organizationUnitData = entry.attributes.organizationUnit.data;
      const organizationUnitId = organizationUnitData.id;
      const organizationUnitName = organizationUnitData.attributes.name;
      const emissionCategoryData =
        entry.attributes.emissionSource.data.attributes.emissionCategory.data;

      if (emissionCategoryData.id !== emissionCategoryId) {
        return;
      }

      if (!emissionEntriesByOrganizationUnit[organizationUnitId]) {
        emissionEntriesByOrganizationUnit[organizationUnitId] = {
          organizationUnit: {
            id: organizationUnitId,
            attributes: {
              name: organizationUnitName,
              createdAt: organizationUnitData.attributes.createdAt,
              updatedAt: organizationUnitData.attributes.updatedAt,
            },
          },
          emissionEntries: [],
        };
      }

      emissionEntriesByOrganizationUnit[
        organizationUnitId
      ].emissionEntries.push(entry);
    },
  );

  return emissionEntriesByOrganizationUnit;
}

export type EmissionResultsByOrganizationUnit = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  emissions: {
    scope1: EmissionsTotalByCategory[];
    scope2: EmissionsTotalByCategory[];
    scope3: EmissionsTotalByCategory[];
    biogenic: EmissionsTotalByCategory[];
  };
};

export function calculateTotalEmissionsByCategoryAndEmissionType(
  emissionResults: EmissionResults,
  emissionType: 'scope1' | 'scope2' | 'scope3' | 'biogenic',
): EmissionCategoryTotalByEmissionType[] {
  const emissionCategoriesTotalEmissionsByScope: EmissionCategoryTotalByEmissionType[] =
    [];

  const organizationUnits = emissionResults?.organizationUnits;
  if (!organizationUnits) return [];

  organizationUnits.forEach((orgUnit) => {
    const emissionCategories = orgUnit.emissions[emissionType];
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
  });

  return emissionCategoriesTotalEmissionsByScope;
}
