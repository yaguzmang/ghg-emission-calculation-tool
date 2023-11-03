'use client';

import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import EmissionsForm from '../emission-form/emissions-form';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons/icons';
import {
  Popover,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Arrow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { findEmissionSourceById } from '@/lib/data/utils';
import { cn } from '@/lib/utils';
import { useDeleteEmissionEntryMutation } from '@/redux/api/emission-entries/emissionEntriesApiSlice';
import { EmissionCategoryFlattenWithSourceGroups } from '@/types/emission-category';
import { EmissionEntryWithOrganizationUnitAndEmissionSource } from '@/types/emission-entry';

interface EmissionsEntryProps {
  reportingPeriodId: number;
  organizationId: number;
  emissionEntry: EmissionEntryWithOrganizationUnitAndEmissionSource;
  emissionCategoryWithFactors: EmissionCategoryFlattenWithSourceGroups;
  onOrganizationUnitChange: (organizationId: number) => void;
}

export default function EmissionsEntry({
  reportingPeriodId,
  organizationId,
  emissionCategoryWithFactors,
  emissionEntry,
  onOrganizationUnitChange,
}: EmissionsEntryProps) {
  const { t } = useTranslation();

  const [deleteEmissionEntry] = useDeleteEmissionEntryMutation();

  const [isEditing, setIsEditing] = useState(false);
  const emissionSource = findEmissionSourceById(
    emissionCategoryWithFactors,
    emissionEntry.attributes.emissionSource.data.id,
  );

  const entryRef = useRef<HTMLDivElement>(null);

  const handleDeleteEntry = () => {
    deleteEmissionEntry(emissionEntry.id);
  };

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
      <div ref={entryRef} className="my-6 flex items-center justify-between">
        <Popover>
          <div className="flex items-center gap-5 text-text-regular-lighten">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button
                      variant="icon"
                      size="fit"
                      className={cn('text-black', { 'text-link': isEditing })}
                      type="button"
                    >
                      <Icons.Trash className="text-black" />
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <span className="text-base">
                    {t('dashboard.form.emissionEntry.deleteTooltip')}
                  </span>
                  <Arrow width={11} height={5} className="fill-tooltip" />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <PopoverAnchor asChild>
              <span>{`${emissionSource?.label} (${emissionSource?.unit})`}</span>
            </PopoverAnchor>
          </div>

          <PopoverPortal>
            <PopoverContent
              align="start"
              side="bottom"
              sideOffset={2}
              className="h-fit rounded-[2px] border border-popover-menu-border bg-popover-menu p-0 shadow-sm"
            >
              <div className="flex flex-row items-center justify-between p-5">
                <PopoverClose asChild>
                  <Button
                    variant="link"
                    size="fit"
                    className="font-bold text-popover-foreground hover:text-popover-foreground"
                    type="button"
                  >
                    <span>{t('forms.cancel')}</span>
                  </Button>
                </PopoverClose>
                <PopoverClose asChild>
                  <Button
                    onClick={() => {
                      handleDeleteEntry();
                    }}
                    className="h-9 p-0"
                    type="button"
                  >
                    <span className="px-5 py-2 text-sm">
                      {t('dashboard.form.emissionEntry.deleteConfirm')}
                    </span>
                  </Button>
                </PopoverClose>
              </div>
            </PopoverContent>
          </PopoverPortal>
        </Popover>

        <Button
          variant="icon"
          size="fit"
          onClick={() => {
            setIsEditing((prevState) => !prevState);
          }}
          className={cn('text-black', { 'text-link': isEditing })}
          type="button"
        >
          <Icons.Edit />
        </Button>
      </div>
      {isEditing && (
        <div className="border border-dotted px-2 py-12 sm:px-10">
          <EmissionsForm
            reportingPeriodId={reportingPeriodId}
            organizationId={organizationId}
            formType="edit"
            emissionEntry={emissionEntry}
            emissionCategoryWithFactors={emissionCategoryWithFactors}
            onOrganizationUnitChange={onOrganizationUnitChange}
            onApiSubmitSucess={handleUpdateSucess}
            onApiSubmitError={() => {}}
            onCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
}
