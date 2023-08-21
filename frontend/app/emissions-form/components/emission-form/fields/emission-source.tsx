'use client';

import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { z } from 'zod';

import { FormCombobox } from '@/components/form/form-combobox';
import { EmissionCategoryFlattenWithSourceGroups } from '@/types/emission-category';
import { EmissionEntryWithOrganizationUnitAndEmissionSource } from '@/types/emission-entry';
import { EmissionEntrySchema } from '@/types/emission-entry-form';

interface EmissionSourceFieldPropsCreate {
  formType: 'create';
  emissionEntry?: never;
}

interface EmissionSourceFieldPropsEdit {
  formType: 'edit';
  emissionEntry: EmissionEntryWithOrganizationUnitAndEmissionSource;
}

type EmissionSourceFieldProps = {
  emissionCategoryWithFactors: EmissionCategoryFlattenWithSourceGroups;
  onSourceChange?: (source: string) => void;
} & (EmissionSourceFieldPropsCreate | EmissionSourceFieldPropsEdit);

export default function EmissionSourceField({
  emissionCategoryWithFactors,
  formType,
  emissionEntry,
  onSourceChange = (_: string) => {},
}: EmissionSourceFieldProps) {
  const { t } = useTranslation();
  const form = useFormContext<z.infer<typeof EmissionEntrySchema>>();
  const [hasSelectedDefault, setHasSelectedDefault] = useState(
    formType === 'create',
  );
  const emissionSources =
    emissionCategoryWithFactors.emissionSourceGroups.flatMap(
      (emissionSourceGroup) => emissionSourceGroup.emissionSources,
    );
  const emissionEntrySourceId =
    emissionEntry?.attributes.emissionSource.data.id;

  const defaultSelectedSource =
    emissionEntrySourceId && formType === 'edit'
      ? `${emissionEntrySourceId}-:-${
          emissionSources
            .find(
              (emissionSource) => emissionSource.id === emissionEntrySourceId,
            )
            ?.name?.toLowerCase() ?? ''
        }`
      : '';

  const [selectedEmissionSourceId, setSelectedEmissionSourceId] = useState<
    string | null
  >(formType === 'edit' ? defaultSelectedSource : null);

  useEffect(() => {
    if (!hasSelectedDefault && selectedEmissionSourceId !== null) {
      onSourceChange(defaultSelectedSource);
      setHasSelectedDefault(true);
    }
  }, [
    selectedEmissionSourceId,
    defaultSelectedSource,
    hasSelectedDefault,
    onSourceChange,
  ]);

  const emissionSourcesSelectLabel =
    emissionCategoryWithFactors.emissionSourceLabel ??
    emissionCategoryWithFactors.emissionSourceGroups[0]?.emissionSourceLabel ??
    '';

  // In order for the search functionality of CMDK to work, the searchable label
  // must be included in the value property. Then, to get the ID afterwards, we
  // can split the selected option by "-:-" and get the first element of the
  // resulting array.
  // More on the issue: https://github.com/pacocoursey/cmdk/issues/74#issuecomment-1402272890
  const emissionSourcesSelectOptions =
    emissionSources?.map((emissionSource) => ({
      value: `${emissionSource.id.toString()}-:-${emissionSource.name.toLowerCase()}`,
      label: emissionSource.name,
    })) ?? [];

  return (
    <div className="mt-10">
      <Controller
        control={form.control}
        name="emissionSource"
        defaultValue={emissionEntrySourceId}
        render={({ field }) => (
          <FormCombobox
            comoboboxRef={field.ref}
            errorMessage={
              form.formState?.errors?.emissionSource?.message !== undefined
                ? t(form.formState.errors.emissionSource.message)
                : undefined
            }
            label={emissionSourcesSelectLabel}
            selectPlaceholder={
              emissionSourcesSelectOptions.length > 0
                ? `${t('forms.dropdown.choose')} ${
                    emissionSourcesSelectLabel ?? ''
                  }`
                : t('dashboard.form.emissionEntry.emissionSource.noneAvailable')
            }
            searchPlaceholder={t('forms.combobox.search')}
            searchNotFoundLabel={t('forms.combobox.search.notFound')}
            options={emissionSourcesSelectOptions}
            onValueChange={(selectedValue: string) => {
              onSourceChange(selectedValue);
              setSelectedEmissionSourceId(selectedValue);
              const newSelectedEmissionSourceId = parseInt(
                selectedValue.split('-:-')[0],
                10,
              );
              field.onChange(newSelectedEmissionSourceId);
            }}
            selectedValue={selectedEmissionSourceId}
          />
        )}
      />
    </div>
  );
}
