import { EmissionCategoryFlattenWithEmissions } from '@/types/emission-category';
import { EmissionScope } from '@/types/emission-scope';

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

export function calculateTotalEmissions(
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

export function calculateTotalDirectEmissions(
  emissionCategories: EmissionCategoryFlattenWithEmissions[],
): number {
  return emissionCategories
    .filter((category) => category.primaryScope === EmissionScope.direct)
    .reduce((total, category) => total + category.emissions.direct, 0);
}

export function calculateTotalIndirectEmissions(
  emissionCategories: EmissionCategoryFlattenWithEmissions[],
): number {
  return emissionCategories
    .filter((category) => category.primaryScope === EmissionScope.indirect)
    .reduce((total, category) => total + category.emissions.indirect, 0);
}

export function calculateTotalValueChainEmissions(
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
