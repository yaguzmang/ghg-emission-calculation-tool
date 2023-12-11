import { useMemo } from 'react';

import { findEmissionSourceById } from '@/lib/data/utils';
import { calculateEmissionEntryTotalGHGEmissions } from '@/lib/statistics/utils';
import { EmissionCategoryFlattenWithSourceGroups } from '@/types/emission-category';
import { EmissionEntryWithOrganizationUnitAndEmissionSource } from '@/types/emission-entry';
import { EmissionSourceFlattenWithFactors } from '@/types/emission-source';

export type SortingField =
  | 'default'
  | 'quantity'
  | 'label'
  | 'tier'
  | 'totalEmissions';
export type SortOrder = 'asc' | 'desc';

const getValueForSort = (
  sortingField: SortingField,
  entry: EmissionEntryWithOrganizationUnitAndEmissionSource & {
    attributes: {
      totalEmissions?: number;
      emissionSourceData: EmissionSourceFlattenWithFactors | null;
    };
  },
) => {
  if (sortingField === 'quantity') {
    return entry.attributes.quantity;
  } if (sortingField === 'label') {
    return (
      entry.attributes.label ||
      entry.attributes.emissionSourceData?.label ||
      ''
    ).toLowerCase();
  } if (sortingField === 'tier') {
    return entry.attributes.tier;
  } if (sortingField === 'totalEmissions') {
    return entry.attributes.totalEmissions ?? 0;
  }
  return 0;
};

const compareValues = (a: string | number, b: string | number): number => {
  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b);
  } 
    return (a as number) - (b as number);
  
};

const useSortEntriesWithTotalEmissions = (
  entries: (EmissionEntryWithOrganizationUnitAndEmissionSource & {
    attributes: {
      totalEmissions?: number;
    };
  })[],
  sortingField: SortingField,
  sortOrder: SortOrder,
  emissionCategoryWithFactors: EmissionCategoryFlattenWithSourceGroups,
) => {
  const entriesCopy = useMemo(() => entries.map((entry) => {
      const emissionSource = findEmissionSourceById(
        emissionCategoryWithFactors,
        entry.attributes.emissionSource.data.id,
      );

      return {
        ...entry,
        attributes: {
          ...entry.attributes,
          totalEmissions: emissionSource
            ? calculateEmissionEntryTotalGHGEmissions(entry, emissionSource)
            : undefined,
          emissionSourceData: emissionSource,
        },
      };
    }), [entries, emissionCategoryWithFactors]);

  const sortedEntries = useMemo(() => {
    if (sortingField === 'default') return entriesCopy;

    entriesCopy.sort((a, b) => {
      const valueA = getValueForSort(sortingField, a);
      const valueB = getValueForSort(sortingField, b);

      if (sortOrder === 'asc') {
        return compareValues(valueA, valueB);
      } 
        return compareValues(valueB, valueA);
      
    });

    return entriesCopy;
  }, [entriesCopy, sortingField, sortOrder]);

  return sortedEntries;
};

export default useSortEntriesWithTotalEmissions;
