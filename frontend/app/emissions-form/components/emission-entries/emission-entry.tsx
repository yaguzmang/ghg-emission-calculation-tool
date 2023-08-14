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
}

export default function EmissionsEntry({
  reportingPeriodId,
  organizationId,
  emissionCategoryWithFactors,
  emissionEntry,
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
      <div ref={entryRef} className="flex justify-between items-center my-6">
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
              className="bg-popover-menu border border-popover-menu-border rounded-[2px] shadow-sm p-0 h-fit"
            >
              <div className="p-5 flex flex-row items-center justify-between">
                <PopoverClose asChild>
                  <Button
                    variant="link"
                    size="fit"
                    className="font-bold text-popover-foreground hover:text-popover-foreground"
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
                  >
                    <span className="px-5 text-sm py-2">
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
        >
          <Icons.Edit />
        </Button>
      </div>
      {isEditing && (
        <div className="border border-dotted px-2 sm:px-10 py-12">
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
