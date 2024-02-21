'use client';

import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import useSortEntriesWithTotalEmissions, {
  SortingField,
  SortOrder,
} from './hooks/useSortEntriesWithTotalEmissions';
import EmissionsEntry from './emission-entry';

import { Icons } from '@/components/ui/icons/icons';
import { cn } from '@/lib/utils';
import { EmissionCategoryFlattenWithSourceGroups } from '@/types/emission-category';
import { EmissionEntryWithOrganizationUnitAndEmissionSource } from '@/types/emission-entry';

interface EmissionsEntriesTableProps {
  emissionEntries: EmissionEntryWithOrganizationUnitAndEmissionSource[];
  reportingPeriodId: number;
  organizationId: number;
  emissionCategoryWithFactors: EmissionCategoryFlattenWithSourceGroups;
  onOrganizationUnitChange: (organizationId: number) => void;
}

export default function EmissionsEntriesTable({
  reportingPeriodId,
  organizationId,
  emissionCategoryWithFactors,
  onOrganizationUnitChange,
  emissionEntries,
}: EmissionsEntriesTableProps) {
  const { t } = useTranslation();

  const handleOrganizationUnitChange = (organizationId: number) => {
    onOrganizationUnitChange(organizationId);
  };

  const [sortingField, setSortingField] = useState<SortingField>('default');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const onTitleClick = (field: SortingField) => {
    if (field === sortingField) {
      // If the same title is clicked again, flip the sorting order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If a new title is clicked, set it as the sorting field and use descending order by default
      setSortingField(field);
      setSortOrder('desc');
    }
  };

  const sortedEntriesWithtCO2 = useSortEntriesWithTotalEmissions(
    emissionEntries,
    sortingField,
    sortOrder,
    emissionCategoryWithFactors,
  );

  const emissionSourcesSelectLabel =
    emissionCategoryWithFactors.emissionSourceLabel ??
    emissionCategoryWithFactors.emissionSourceGroups[0]?.emissionSourceLabel ??
    '';

  return (
    <div className="flex flex-col">
      <div className="my-2 ml-auto flex items-center gap-3 pr-[2px]" />
      <div className="grid w-full grid-cols-[min-content_auto_auto_auto_auto_min-content] items-center gap-x-4 gap-y-6">
        <button
          type="button"
          className="col-start-2 mb-[-44px] flex items-center gap-2 break-words text-text-regular-lighten"
          onClick={() => onTitleClick('label')}
        >
          <span>
            {emissionSourcesSelectLabel ??
              t('dashboard.form.emissionEntry.emissionLabelSource')}
          </span>
          <Icons.ChevronDown
            className={cn('h-2 w-2 text-text-regular-lighten', {
              'rotate-180': sortOrder === 'asc' && sortingField === 'label',
              'text-primary': sortingField === 'label',
            })}
          />
        </button>
        <button
          type="button"
          className="mb-[-44px] flex items-center gap-2 break-words text-text-regular-lighten"
          onClick={() => onTitleClick('quantity')}
        >
          <span>{t('dashboard.form.emissionEntry.quantity')}</span>
          <Icons.ChevronDown
            className={cn('h-2 w-2 text-text-regular-lighten', {
              'rotate-180': sortOrder === 'asc' && sortingField === 'quantity',
              'text-primary': sortingField === 'quantity',
            })}
          />
        </button>
        <button
          type="button"
          className="mb-[-44px] flex items-center gap-2 break-all font-bold text-black"
          onClick={() => onTitleClick('totalEmissions')}
        >
          <span>
            <Trans i18nKey="common.tco2e" />
          </span>
          <Icons.ChevronDown
            className={cn('h-2 w-2 text-text-regular-lighten', {
              'rotate-180':
                sortOrder === 'asc' && sortingField === 'totalEmissions',
              'text-primary': sortingField === 'totalEmissions',
            })}
          />
        </button>
        <button
          type="button"
          className="mb-[-44px] hidden items-center gap-2 justify-self-center break-words text-black sm:flex"
          onClick={() => onTitleClick('tier')}
        >
          <span>{t('dashboard.form.emissionEntry.tier')}</span>
          <Icons.ChevronDown
            className={cn('h-2 w-2 text-text-regular-lighten', {
              'rotate-180': sortOrder === 'asc' && sortingField === 'tier',
              'text-primary': sortingField === 'tier',
            })}
          />
        </button>
        <div className="col-span-full col-start-2 col-end-6 mb-[-20px] flex w-full items-center gap-2 border-b px-2 sm:px-10" />
        {sortedEntriesWithtCO2.map((emissionEntry) => (
          <EmissionsEntry
            key={`emissionEntryItem-${emissionEntry.id}`}
            reportingPeriodId={reportingPeriodId}
            organizationId={organizationId}
            emissionCategoryWithFactors={emissionCategoryWithFactors}
            emissionEntry={emissionEntry}
            onOrganizationUnitChange={handleOrganizationUnitChange}
          />
        ))}
      </div>
    </div>
  );
}
