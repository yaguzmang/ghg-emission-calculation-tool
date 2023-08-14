'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { z } from 'zod';

import FormInput from '@/components/form/form-input';
import { EmissionEntryWithOrganizationUnitAndEmissionSource } from '@/types/emission-entry';
import { EmissionEntrySchema } from '@/types/emission-entry-form';

interface QuantitySourceFieldPropsCreate {
  formType: 'create';
  emissionEntry?: never;
}

interface QuantitySourceFieldPropsEdit {
  formType: 'edit';
  emissionEntry: EmissionEntryWithOrganizationUnitAndEmissionSource;
}

type QuantitySourceFieldProps =
  | QuantitySourceFieldPropsCreate
  | QuantitySourceFieldPropsEdit;

export default function QuantitySourceField({
  formType,
  emissionEntry,
}: QuantitySourceFieldProps) {
  const { t } = useTranslation();
  const form = useFormContext<z.infer<typeof EmissionEntrySchema>>();

  return (
    <div className="mt-10">
      <FormInput
        defaultValue={
          formType === 'edit'
            ? emissionEntry?.attributes?.quantitySource ?? undefined
            : undefined
        }
        type="text"
        id="quantitySource"
        label={t('dashboard.form.emissionEntry.accuracy.source')}
        className="font-bold text-foreground"
        {...form.register('quantitySource')}
        errorMessage={
          form.formState?.errors?.quantitySource?.message !== undefined
            ? t(form.formState.errors.quantitySource.message)
            : undefined
        }
      />
    </div>
  );
}
