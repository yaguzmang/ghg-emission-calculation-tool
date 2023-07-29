'use client';

import React, { useRef, useState } from 'react';

import EmissionsForm from '../emission-form/emissions-form';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons/icons';
import { findEmissionSourceById } from '@/lib/data/utils';
import { cn } from '@/lib/utils';
import { EmissionCategoryFlattenWithSourceGroups } from '@/types/emission-category';
import { EmissionEntryWithOrganizationUnitAndEmissionSource } from '@/types/emission-entry';

interface EmissionsEntryProps {
  reportingPeriodId: number;
  organizationId: number;
  emissionEntry: EmissionEntryWithOrganizationUnitAndEmissionSource;
  emissionCategoryWithFactors: EmissionCategoryFlattenWithSourceGroups;
}

export default function EmissionsEntry({
  reportingPeriodId,
  organizationId,
  emissionCategoryWithFactors,
  emissionEntry,
}: EmissionsEntryProps) {
  const [isEditing, setIsEditing] = useState(false);
  const emissionSource = findEmissionSourceById(
    emissionCategoryWithFactors,
    emissionEntry.attributes.emissionSource.data.id,
  );

  const entryRef = useRef<HTMLDivElement>(null);

  const handleUpdateSucess = () => {
    setIsEditing(false);
    entryRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    entryRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  return (
    <div>
      <div ref={entryRef} className="flex justify-between items-center my-6">
        <div className="flex items-center gap-5 text-text-regular-lighten">
          <Icons.EmissionEntry className="text-black" />
          <span>{emissionSource?.label}</span>
        </div>
        <Button
          variant="icon"
          size="fit"
          onClick={() => {
            setIsEditing((prevState) => !prevState);
          }}
          className={cn('text-black', { 'text-link': isEditing })}
        >
          <Icons.Edit />
        </Button>
      </div>
      {isEditing && (
        <div className="border border-dotted px-10 py-12">
          <EmissionsForm
            reportingPeriodId={reportingPeriodId}
            organizationId={organizationId}
            formType="edit"
            emissionEntry={emissionEntry}
            emissionCategoryWithFactors={emissionCategoryWithFactors}
            onApiSubmitSucess={handleUpdateSucess}
            onApiSubmitError={() => {}}
            onCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
}
