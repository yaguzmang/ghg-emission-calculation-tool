'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { z } from 'zod';

import FormInput from '@/components/form/form-input';
import { EmissionEntryWithOrganizationUnitAndEmissionSource } from '@/types/emission-entry';
import { EmissionEntrySchema } from '@/types/emission-entry-form';

interface LabelFieldPropsCreate {
  formType: 'create';
  emissionEntry?: never;
}

interface LabelFieldPropsEdit {
  formType: 'edit';
  emissionEntry: EmissionEntryWithOrganizationUnitAndEmissionSource;
}

type LabelFieldProps = LabelFieldPropsCreate | LabelFieldPropsEdit;

export default function LabelField({
  formType,
  emissionEntry,
}: LabelFieldProps) {
  const { t } = useTranslation();
  const form = useFormContext<z.infer<typeof EmissionEntrySchema>>();

  return (
    <div className="mb-10">
      <FormInput
        defaultValue={
          formType === 'edit'
            ? emissionEntry?.attributes?.label ?? undefined
            : undefined
        }
        type="text"
        id="label"
        label={t('dashboard.form.emissionEntry.label')}
        className="font-bold text-foreground"
        {...form.register('label')}
        errorMessage={
          form.formState?.errors?.label?.message !== undefined
            ? t(form.formState.errors.label.message)
            : undefined
        }
      />
    </div>
  );
}
