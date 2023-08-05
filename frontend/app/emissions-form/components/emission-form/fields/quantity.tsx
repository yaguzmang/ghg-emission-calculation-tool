'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { z } from 'zod';

import FormInput from '@/components/form/form-input';
import { EmissionCategoryFlattenWithSourceGroups } from '@/types/emission-category';
import { EmissionEntryWithOrganizationUnitAndEmissionSource } from '@/types/emission-entry';
import { EmissionEntrySchema } from '@/types/emission-entry-form';
import { EmissionSourceFlattenWithFactors } from '@/types/emission-source';

interface QuantityFieldPropsCreate {
  formType: 'create';
  emissionEntry?: never;
}

interface QuantityFieldPropsEdit {
  formType: 'edit';
  emissionEntry: EmissionEntryWithOrganizationUnitAndEmissionSource;
}

type QuantityFieldProps = {
  emissionCategoryWithFactors: EmissionCategoryFlattenWithSourceGroups;
  selectedEmissionSource: EmissionSourceFlattenWithFactors | null;
} & (QuantityFieldPropsCreate | QuantityFieldPropsEdit);

export default function QuantityField({
  emissionCategoryWithFactors,
  formType,
  emissionEntry,
  selectedEmissionSource,
}: QuantityFieldProps) {
  const { t } = useTranslation();
  const form = useFormContext<z.infer<typeof EmissionEntrySchema>>();

  const emissionQuantityLabel =
    emissionCategoryWithFactors.quantityLabel !== null
      ? emissionCategoryWithFactors.quantityLabel
      : t('dashboard.form.emissionEntry.quantity');

  return (
    <div className="mt-10">
      <FormInput
        defaultValue={
          formType === 'edit' ? emissionEntry.attributes.quantity : undefined
        }
        type="number"
        id="quantity"
        step="any"
        onWheel={(e) => e.currentTarget.blur()}
        label={emissionQuantityLabel}
        secondaryLabel={selectedEmissionSource?.unit}
        className="font-bold text-foreground"
        {...form.register('quantity', { valueAsNumber: true })}
        errorMessage={
          form.formState?.errors?.quantity?.message !== undefined
            ? t(form.formState.errors.quantity.message)
            : undefined
        }
      />
    </div>
  );
}
