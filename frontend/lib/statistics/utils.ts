import { EmissionCategoryFlattenWithEmissions } from '@/types/emission-category';
import { EmissionEntryWithOrganizationUnitAndEmissionSource } from '@/types/emission-entry';
import { EmissionScope } from '@/types/emission-scope';
import { EmissionSourceFlattenWithFactors } from '@/types/emission-source';

export function calculateTotalEmissionsOfEmissionCategory(
  emissionCategory: EmissionCategoryFlattenWithEmissions,
  includeBiogenic = false,
) {
  if (emissionCategory) {
    const { emissions } = emissionCategory;
    const sum = Object.entries(emissions)
      .filter(([key, value]) => {
        if (!includeBiogenic && key === 'biogenic') {
          return false; // Exclude biogenic emission property
        }
        return typeof value === 'number';
      })
      .reduce((acc, [, value]) => acc + value, 0);
    return sum;
  }
  return 0;
}

export function calculateTotalEmissionsFromEmissionCategories(
  emissionCategories: EmissionCategoryFlattenWithEmissions[],
  includeBiogenic = false,
): number {
  let totalEmissions = 0;

  emissionCategories.forEach((emissionCategory) => {
    totalEmissions += calculateTotalEmissionsOfEmissionCategory(
      emissionCategory,
      includeBiogenic,
    );
  });

  return totalEmissions;
}

export function calculateTotalActivityEmissions(
  emissionCategories: EmissionCategoryFlattenWithEmissions[],
): number {
  let totalActivityEmissions = 0;

  emissionCategories.forEach((category) => {
    const activityEmission = category.emissions.direct;
    if (typeof activityEmission === 'number') {
      totalActivityEmissions += activityEmission;
    }
  });

  return totalActivityEmissions;
}

export function calculateTotalUpstreamEmissions(
  emissionCategories: EmissionCategoryFlattenWithEmissions[],
): number {
  let totalUpstreamEmissions = 0;

  emissionCategories.forEach((category) => {
    const upstreamEmission = category.emissions.indirect;
    if (typeof upstreamEmission === 'number') {
      totalUpstreamEmissions += upstreamEmission;
    }
  });

  return totalUpstreamEmissions;
}

export function calculateTotalBiogenicEmissions(
  emissionCategories: EmissionCategoryFlattenWithEmissions[],
): number {
  let totalBiogenicEmissions = 0;

  emissionCategories.forEach((category) => {
    const biogenicEmission = category.emissions.biogenic;
    if (typeof biogenicEmission === 'number') {
      totalBiogenicEmissions += biogenicEmission;
    }
  });

  return totalBiogenicEmissions;
}

export function calculateTotalDirectEmissionsFromEmissionCategories(
  emissionCategories: EmissionCategoryFlattenWithEmissions[],
): number {
  return emissionCategories
    .filter((category) => category.primaryScope === EmissionScope.direct)
    .reduce((total, category) => total + category.emissions.direct, 0);
}

export function calculateTotalIndirectEmissionsFromEmissionCategories(
  emissionCategories: EmissionCategoryFlattenWithEmissions[],
): number {
  return emissionCategories
    .filter((category) => category.primaryScope === EmissionScope.indirect)
    .reduce((total, category) => total + category.emissions.indirect, 0);
}

export function calculateTotalValueChainEmissionsFromEmissionCategories(
  emissionCategories: EmissionCategoryFlattenWithEmissions[],
): number {
  return emissionCategories.reduce((total, category) => {
    let categoryTotal = total + category.emissions.indirect;
    if (category.primaryScope === EmissionScope.valueChain) {
      categoryTotal += category.emissions.direct;
    }
    return categoryTotal;
  }, 0);
}

export function calculateEmissionEntryTotalGHGEmissions(
  emissionEntryWithEmissionSource: EmissionEntryWithOrganizationUnitAndEmissionSource,
  emissionSource: EmissionSourceFlattenWithFactors,
): number {
  const emissionQuantity = emissionEntryWithEmissionSource.attributes.quantity;
  const { customEmissionFactorDirect, customEmissionFactorIndirect } =
    emissionEntryWithEmissionSource.attributes;

  const { indirect: emissionFactorIndirect, direct: emissionFactorDirect } =
    emissionSource?.factors ?? {};

  let total = 0;

  if (typeof customEmissionFactorDirect?.value === 'number') {
    total += emissionQuantity * customEmissionFactorDirect.value;
  } else if (typeof emissionFactorDirect?.value === 'number') {
    total += emissionQuantity * emissionFactorDirect.value;
  }

  if (typeof customEmissionFactorIndirect?.value === 'number') {
    total += emissionQuantity * customEmissionFactorIndirect.value;
  } else if (typeof emissionFactorIndirect?.value === 'number') {
    total += emissionQuantity * emissionFactorIndirect.value;
  }

  return total;
}

export function calculateCategoryTotalGHGEmissions(
  emissionEntriesWithEmissionSource: EmissionEntryWithOrganizationUnitAndEmissionSource[],
  emissionSourcesWithFactors: EmissionSourceFlattenWithFactors[],
): number {
  return emissionEntriesWithEmissionSource.reduce((total, emissionEntry) => {
    const emissionEntrySourceId =
      emissionEntry.attributes.emissionSource.data.id;
    const emissionSource = emissionSourcesWithFactors.find(
      (emissionSource) => emissionSource.id === emissionEntrySourceId,
    );

    if (!emissionSource) return total;

    const categoryTotal =
      total +
      calculateEmissionEntryTotalGHGEmissions(emissionEntry, emissionSource);
    return categoryTotal;
  }, 0);
}

export function calculateEmissionEntryTotalBiogenicEmissions(
  emissionEntryWithEmissionSource: EmissionEntryWithOrganizationUnitAndEmissionSource,
  emissionSource: EmissionSourceFlattenWithFactors,
): number {
  const emissionQuantity = emissionEntryWithEmissionSource.attributes.quantity;
  const { customEmissionFactorBiogenic } =
    emissionEntryWithEmissionSource.attributes;

  const { biogenic: emissionFactorBiogenic } = emissionSource?.factors ?? {};

  let total = 0;

  if (typeof customEmissionFactorBiogenic?.value === 'number') {
    total += emissionQuantity * customEmissionFactorBiogenic.value;
  } else if (typeof emissionFactorBiogenic?.value === 'number') {
    total += emissionQuantity * emissionFactorBiogenic.value;
  }

  return total;
}

export function calculateCategoryTotalBiogenicEmissions(
  emissionEntriesWithEmissionSource: EmissionEntryWithOrganizationUnitAndEmissionSource[],
  emissionSourcesWithFactors: EmissionSourceFlattenWithFactors[],
): number {
  return emissionEntriesWithEmissionSource.reduce((total, emissionEntry) => {
    const emissionEntrySourceId =
      emissionEntry.attributes.emissionSource.data.id;
    const emissionSource = emissionSourcesWithFactors.find(
      (emissionSource) => emissionSource.id === emissionEntrySourceId,
    );

    if (!emissionSource) return total;

    const categoryTotal =
      total +
      calculateEmissionEntryTotalBiogenicEmissions(
        emissionEntry,
        emissionSource,
      );
    return categoryTotal;
  }, 0);
}

export function getAccuracyReliability(
  number: number,
): 'low' | 'medium' | 'high' | '' {
  if (number >= 0 && number <= 1) {
    return 'low';
  } if (number > 1 && number <= 2) {
    return 'medium';
  } if (number > 2) {
    return 'high';
  }
  return '';
}
