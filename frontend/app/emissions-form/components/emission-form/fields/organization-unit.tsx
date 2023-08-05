'use client';

import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { z } from 'zod';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetOrganizationUnitsByOrganizationQuery } from '@/redux/api/organization-units/organizationUnitsApiSlice';
import { EmissionEntryWithOrganizationUnitAndEmissionSource } from '@/types/emission-entry';
import { EmissionEntrySchema } from '@/types/emission-entry-form';

interface OrganizationUnitFieldPropsCreate {
  formType: 'create';
  emissionEntry?: never;
}

interface OrganizationUnitFieldPropsEdit {
  formType: 'edit';
  emissionEntry: EmissionEntryWithOrganizationUnitAndEmissionSource;
}

type OrganizationUnitFieldProps = {
  organizationId: number;
} & (OrganizationUnitFieldPropsCreate | OrganizationUnitFieldPropsEdit);

export default function OrganizationUnitField({
  organizationId,
  formType,
  emissionEntry,
}: OrganizationUnitFieldProps) {
  const { t } = useTranslation();
  const form = useFormContext<z.infer<typeof EmissionEntrySchema>>();

  const organizationUnits = useGetOrganizationUnitsByOrganizationQuery(
    organizationId ?? 0,
    { skip: organizationId === undefined },
  );

  const organizationUnitsSelectOptions =
    organizationUnits.currentData?.map((organizationUnit) => ({
      value: organizationUnit.id,
      label: organizationUnit.attributes.name,
    })) ?? [];
  const emissionEntryOrganizationUnitId =
    emissionEntry?.attributes.organizationUnit.data.id;
  const [selectedOrganizationUnitId, setSelectedOrganizationUnitId] = useState<
    number | null
  >(
    formType === 'edit'
      ? emissionEntry.attributes.organizationUnit.data.id
      : null,
  );

  return (
    <div className="gap-4">
      <span className="text-text-regular text-sm">
        {t('dashboard.form.emissionEntry.organizationUnit')}
      </span>
      <Controller
        control={form.control}
        name="organizationUnit"
        defaultValue={emissionEntryOrganizationUnitId}
        render={({ field }) => (
          <Select
            key={organizationUnitsSelectOptions?.[0]?.value ?? -1}
            onValueChange={(selectedValue: string) => {
              const newSelectedOrganizationUnitId = parseInt(selectedValue, 10);
              setSelectedOrganizationUnitId(newSelectedOrganizationUnitId);
              field.onChange(newSelectedOrganizationUnitId);
            }}
            value={
              selectedOrganizationUnitId !== null
                ? selectedOrganizationUnitId.toString()
                : undefined
            }
          >
            <SelectTrigger
              ref={field.ref}
              error={
                form.formState?.errors?.organizationUnit?.message !== undefined
              }
            >
              <SelectValue
                placeholder={t(
                  'dashboard.form.emissionEntry.organizationUnit.choose',
                )}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {organizationUnitsSelectOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value.toString()}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
      {form.formState?.errors?.organizationUnit?.message !== undefined && (
        <span className="text-sm text-destructive">
          {form.formState?.errors?.organizationUnit?.message !== undefined
            ? t(form.formState.errors.organizationUnit.message)
            : undefined}
        </span>
      )}
    </div>
  );
}
