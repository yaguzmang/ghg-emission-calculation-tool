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
import { kgsToTons } from '@/lib/numbers.ts/conversion';
import { cn } from '@/lib/utils';
import { useDeleteEmissionEntryMutation } from '@/redux/api/emission-entries/emissionEntriesApiSlice';
import { EmissionCategoryFlattenWithSourceGroups } from '@/types/emission-category';
import { EmissionEntryWithOrganizationUnitAndEmissionSource } from '@/types/emission-entry';
import { EmissionSourceFlattenWithFactors } from '@/types/emission-source';

interface EmissionsEntryProps {
  reportingPeriodId: number;
  organizationId: number;
  emissionEntry: EmissionEntryWithOrganizationUnitAndEmissionSource & {
    attributes: {
      totalEmissions?: number;
      emissionSourceData: EmissionSourceFlattenWithFactors | null;
    };
  };
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
  const emissionSource = emissionEntry.attributes.emissionSourceData;

  const entryRef = useRef<HTMLButtonElement>(null);

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
    <>
      <Popover>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="icon"
                  size="fit"
                  className={cn('col-start-1 text-black', {
                    'text-link': isEditing,
                  })}
                  type="button"
                >
                  <Icons.Trash className="h-4 w-4" />
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

        <PopoverAnchor className="col-start-2" asChild>
          {emissionEntry.attributes.label ? (
            <div className="flex flex-col gap-y-0 text-text-regular-lighten">
              <span className="break-words font-bold leading-none">
                {emissionEntry.attributes.label}
              </span>
              <span className="break-words leading-tight ">{`${emissionSource?.label} (${emissionSource?.unit})`}</span>
            </div>
          ) : (
            <span className="break-words text-text-regular-lighten">{`${emissionSource?.label} (${emissionSource?.unit})`}</span>
          )}
        </PopoverAnchor>

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

      <span className="col-start-3 max-w-[100px] break-all text-black">
        {emissionEntry.attributes.quantity}
      </span>
      <span className="col-start-4 break-all font-bold">
        {emissionEntry.attributes.totalEmissions !== undefined
          ? kgsToTons(emissionEntry.attributes.totalEmissions).toFixed(3)
          : ''}
      </span>
      <div
        className={cn(
          'col-start-5 hidden h-5  w-fit flex-col items-center justify-center justify-self-center rounded-full text-center align-middle text-[10px] text-primary sm:flex',
          {
            'bg-gray-lighten': emissionEntry.attributes.tier === 0,
          },
          {
            'bg-gradient-to-r from-accuracy-low-gradient-from to-accuracy-low-gradient-to':
              emissionEntry.attributes.tier === 1,
          },
          {
            'bg-gradient-to-r from-accuracy-medium-gradient-from to-accuracy-medium-gradient-to':
              emissionEntry.attributes.tier === 2,
          },
          {
            'bg-gradient-to-r from-accuracy-high-gradient-from to-accuracy-high-gradient-to':
              emissionEntry.attributes.tier === 3,
          },
        )}
      >
        <span className="px-3">{`${t('dashboard.form.emissionEntry.tier')} ${
          emissionEntry.attributes.tier
        }`}</span>
      </div>

      <Button
        ref={entryRef}
        variant="icon"
        size="fit"
        onClick={() => {
          setIsEditing((prevState) => !prevState);
        }}
        className={cn('text-black', { 'text-link': isEditing })}
        type="button"
      >
        <Icons.Edit className="h-4 w-4" />
      </Button>
      {isEditing && (
        <div className="col-span-full w-full border border-dotted px-2 py-12 sm:px-10">
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
    </>
  );
}
