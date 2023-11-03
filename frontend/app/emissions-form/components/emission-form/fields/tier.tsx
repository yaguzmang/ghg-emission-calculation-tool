'use client';

import React, { useEffect, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { z } from 'zod';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { EmissionEntryWithOrganizationUnitAndEmissionSource } from '@/types/emission-entry';
import { EmissionEntrySchema } from '@/types/emission-entry-form';
import { EmissionSourceFlattenWithFactors } from '@/types/emission-source';

interface TierFieldPropsCreate {
  formType: 'create';
  emissionEntry?: never;
}

interface TierFieldPropsEdit {
  formType: 'edit';
  emissionEntry: EmissionEntryWithOrganizationUnitAndEmissionSource;
}

type TierFieldProps = {
  selectedEmissionSource: EmissionSourceFlattenWithFactors | null;
} & (TierFieldPropsCreate | TierFieldPropsEdit);

export default function TierField({
  formType,
  emissionEntry,
  selectedEmissionSource,
}: TierFieldProps) {
  const { t } = useTranslation();
  const form = useFormContext<z.infer<typeof EmissionEntrySchema>>();

  const isSourceEEIO = selectedEmissionSource?.unit === '€';
  const prevIsSourceEEIORef = useRef<boolean | null>(null);

  useEffect(() => {
    if (
      prevIsSourceEEIORef.current !== null &&
      prevIsSourceEEIORef.current !== isSourceEEIO
    ) {
      if (isSourceEEIO) {
        form.setValue('tier', 0);
        form.trigger('tier');
      } else if (formType === 'edit' && emissionEntry?.attributes?.tier === 0) {
        // The emission entry tier is 0 but the source is not EEIO,
        // so the Tier has to be either 1, 2, or 3. To enforce that, set to -1
        // so the validation fails and the user needs to choose a new tier.
        form.setValue('tier', -1);
      } else if (formType === 'edit' && emissionEntry?.attributes?.tier !== 0) {
        // User had switched to EEIO source, which set the tier to 0, so restore
        // the original value.
        form.setValue('tier', emissionEntry?.attributes?.tier ?? -1);
      } else {
        // User switched between EEIO and non EEIO source, so clean up the selected
        // tier 0.
        form.setValue('tier', -1);
      }
    }
    prevIsSourceEEIORef.current = isSourceEEIO;
  }, [isSourceEEIO, emissionEntry?.attributes?.tier, form, formType]);

  return (
    <div className="mt-10 flex flex-wrap justify-between gap-y-6">
      <span className="text-sm font-bold">
        {t('dashboard.form.emissionEntry.accuracy')}
      </span>

      {isSourceEEIO ? (
        <ToggleGroup value="0" type="single" disabled>
          <ToggleGroupItem
            value="0"
            className={
              form.formState?.errors?.tier?.message !== undefined
                ? 'border-destructive'
                : ''
            }
          >
            <span className="px-3">{`${t(
              'dashboard.form.emissionEntry.tier',
            )} 0`}</span>
          </ToggleGroupItem>
        </ToggleGroup>
      ) : (
        <Controller
          defaultValue={
            formType === 'edit' ? emissionEntry?.attributes?.tier : undefined
          }
          control={form.control}
          name="tier"
          render={({ field }) => (
            <ToggleGroup
              defaultValue={
                formType === 'edit'
                  ? emissionEntry?.attributes?.tier?.toString()
                  : undefined
              }
              ref={field.ref}
              type="single"
              onValueChange={(selectedValue: string) => {
                const selectedTier = parseInt(selectedValue, 10);
                field.onChange(selectedTier);
              }}
              className="flex-wrap"
            >
              <ToggleGroupItem
                value="1"
                className={
                  form.formState?.errors?.tier?.message !== undefined
                    ? 'border-destructive'
                    : ''
                }
              >
                <span className="px-3">{`${t(
                  'dashboard.form.emissionEntry.tier',
                )} 1`}</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="2"
                className={
                  form.formState?.errors?.tier?.message !== undefined
                    ? 'border-destructive'
                    : ''
                }
              >
                <span className="px-3">{`${t(
                  'dashboard.form.emissionEntry.tier',
                )} 2`}</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="3"
                className={
                  form.formState?.errors?.tier?.message !== undefined
                    ? 'border-destructive'
                    : ''
                }
              >
                <span className="px-3">{`${t(
                  'dashboard.form.emissionEntry.tier',
                )} 3`}</span>{' '}
              </ToggleGroupItem>
            </ToggleGroup>
          )}
        />
      )}

      {form.formState?.errors?.tier?.message !== undefined && (
        <span className="basis-full text-sm text-destructive">
          {t(form.formState.errors.tier.message)}
        </span>
      )}
    </div>
  );
}
