'use client';

import React, { useState } from 'react';
import { Controller,FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import EmissionFactorsForm from './emission-factors-form';

import { FormCombobox } from '@/components/form/form-combobox';
import FormInput from '@/components/form/form-input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContentReadMore,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { findEmissionSourceById } from '@/lib/data/utils';
import {
  CreateEmissionEntryData,
  CustomEmissionFactor,
  useCreateEmissionEntryMutation,
  useUpdateEmissionEntryMutation,
} from '@/redux/api/emission-entries/emissionEntriesApiSlice';
import { useGetOrganizationUnitsByOrganizationQuery } from '@/redux/api/organization-units/organizationUnitsApiSlice';
import { EmissionCategoryFlattenWithSourceGroups } from '@/types/emission-category';
import { EmissionEntryWithOrganizationUnitAndEmissionSource } from '@/types/emission-entry';

const CustomEmissionFactorSchema: z.ZodType<CustomEmissionFactor> = z.object({
  value: z.coerce.number().nonnegative({
    message: 'Please provide a positive value for the custom emission factor.',
  }),
  source: z.string().min(1, {
    message: 'Please input a source.',
  }),
});

const EmissionEntrySchema: z.ZodType<CreateEmissionEntryData> = z.object({
  // TODO: Add translations for error messages
  organizationUnit: z.coerce
    .number({
      invalid_type_error: 'Please select an organization unit.',
    })
    .int()
    .positive({
      message: 'Please select an organization unit.',
    }),
  reportingPeriod: z.coerce
    .number({
      invalid_type_error: 'Please select a reporting period.',
    })
    .int()
    .positive({
      message: 'Please select a reporting period.',
    }),
  emissionSource: z.coerce
    .number({
      invalid_type_error: 'Please select an emission source.',
    })
    .int()
    .positive({
      message: 'Please select an emission source.',
    }),
  quantity: z.coerce
    .number({
      invalid_type_error: 'Please input a valid quantity.',
    })
    .nonnegative({
      message: 'Please input a valid quantity.',
    }),
  tier: z.coerce
    .number({
      invalid_type_error: 'Please select a tier.',
    })
    .int()
    .nonnegative({
      message: 'Please select a tier.',
    }),
  quantitySource: z.string().optional(),
  customEmissionFactorDirect: CustomEmissionFactorSchema.optional().nullable(),
  customEmissionFactorIndirect:
    CustomEmissionFactorSchema.optional().nullable(),
  customEmissionFactorBiogenic:
    CustomEmissionFactorSchema.optional().nullable(),
});

interface EmissionsFormPropsCreate {
  formType: 'create';
  emissionEntry?: never;
}

interface EmissionsFormPropsEdit {
  formType: 'edit';
  emissionEntry: EmissionEntryWithOrganizationUnitAndEmissionSource;
}

type EmissionsFormProps = {
  reportingPeriodId: number;
  organizationId: number;
  emissionCategoryWithFactors: EmissionCategoryFlattenWithSourceGroups;
  onApiSubmitSucess: () => void;
  onApiSubmitError: () => void;
  onCancel: () => void;
} & (EmissionsFormPropsCreate | EmissionsFormPropsEdit);

export default function EmissionsForm({
  reportingPeriodId,
  organizationId,
  formType,
  emissionEntry,
  emissionCategoryWithFactors,
  onApiSubmitSucess,
  onApiSubmitError,
  onCancel,
}: EmissionsFormProps) {
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof EmissionEntrySchema>>({
    resolver: zodResolver(EmissionEntrySchema),
  });

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

  const emissionSourcesSelectLabel =
    emissionCategoryWithFactors.emissionSourceLabel ??
    emissionCategoryWithFactors.emissionSourceGroups[0]?.emissionSourceLabel ??
    '';
  // TODO: Handle empty categories

  const emissionSources =
    emissionCategoryWithFactors.emissionSourceGroups.flatMap(
      (emissionSourceGroup) => emissionSourceGroup.emissionSources,
    );

  const emissionEntrySourceId =
    emissionEntry?.attributes.emissionSource.data.id;

  const [selectedEmissionSourceId, setSelectedEmissionSourceId] = useState<
    string | null
  >(
    formType === 'edit'
      ? `${emissionEntrySourceId}-:-${
          emissionSources
            .find(
              (emissionSource) => emissionSource.id === emissionEntrySourceId,
            )
            ?.name?.toLowerCase() ?? ''
        }`
      : null,
  );

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

  const [createEmissionEntry, createEmissionEntryState] =
    useCreateEmissionEntryMutation();

  const [updateEmissionEntry, updateEmissionEntryState] =
    useUpdateEmissionEntryMutation();

  async function onSubmit(data: z.infer<typeof EmissionEntrySchema>) {
    let result = null;
    if (formType === 'create') {
      result = await createEmissionEntry(data);
    } else if (formType === 'edit') {
      result = await updateEmissionEntry({
        emisionEntryId: emissionEntry.id,
        emissionEntryAttributes: data,
      });
    }
    if (result !== null && !('error' in result) && result.data) {
      onApiSubmitSucess();
    } else {
      onApiSubmitError();
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <FormInput
          type="hidden"
          id="reportingPeriod"
          value={reportingPeriodId ?? -1}
          errorMessage={form.formState.errors.reportingPeriod?.message}
          {...form.register('reportingPeriod')}
        />
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
                  const newSelectedOrganizationUnitId = parseInt(
                    selectedValue,
                    10,
                  );
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
                    form.formState?.errors?.organizationUnit?.message !==
                    undefined
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
              {form.formState.errors.organizationUnit?.message}
            </span>
          )}
        </div>

        <div className="mt-10">
          <Controller
            control={form.control}
            name="emissionSource"
            defaultValue={emissionEntrySourceId}
            render={({ field }) => (
              <FormCombobox
                comoboboxRef={field.ref}
                errorMessage={form.formState?.errors?.emissionSource?.message}
                label={emissionSourcesSelectLabel}
                selectPlaceholder={
                  emissionSourcesSelectOptions.length > 0
                    ? `${t('forms.dropdown.choose')} ${
                        emissionSourcesSelectLabel ?? ''
                      }`
                    : t(
                        'dashboard.form.emissionEntry.emissionSource.noneAvailable',
                      )
                }
                searchPlaceholder={t('forms.combobox.search')}
                searchNotFoundLabel={t('forms.combobox.search.notFound')}
                options={emissionSourcesSelectOptions}
                onValueChange={(selectedValue: string) => {
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

        <div className="mt-10">
          <FormInput
            defaultValue={
              formType === 'edit'
                ? emissionEntry.attributes.quantity
                : undefined
            }
            type="number"
            id="quantity"
            step="any"
            onWheel={(e) => e.currentTarget.blur()}
            label={t('dashboard.form.emissionEntry.quantity')}
            // secondaryLabel={'TODO: add unit'}
            className="font-bold text-foreground"
            {...form.register('quantity', { valueAsNumber: true })}
            errorMessage={form.formState.errors.quantity?.message}
          />
        </div>

        <div className="mt-10 flex justify-between flex-wrap">
          <span className="text-sm font-bold">
            {t('dashboard.form.emissionEntry.accuracy')}
          </span>

          <Controller
            defaultValue={
              formType === 'edit' ? emissionEntry?.attributes?.tier : undefined
            }
            control={form.control}
            name="tier"
            render={({ field }) => (
              // TODO: Add tier 0
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
              >
                <ToggleGroupItem
                  value="1"
                  className={
                    form.formState?.errors?.tier?.message !== undefined
                      ? 'border-destructive'
                      : ''
                  }
                >
                  <span className="px-3">Tier 1</span>
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="2"
                  className={
                    form.formState?.errors?.tier?.message !== undefined
                      ? 'border-destructive'
                      : ''
                  }
                >
                  <span className="px-3">Tier 2</span>
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="3"
                  className={
                    form.formState?.errors?.tier?.message !== undefined
                      ? 'border-destructive'
                      : ''
                  }
                >
                  <span className="px-3">Tier 3</span>{' '}
                </ToggleGroupItem>
              </ToggleGroup>
            )}
          />
          {form.formState?.errors?.tier?.message !== undefined && (
            <span className="text-sm text-destructive basis-full">
              {form.formState.errors.tier.message}
            </span>
          )}
        </div>
        <div className="ml-auto mt-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="link" size="fit" type="button">
                {t('dashboard.form.emissionEntry.accuracy.readMore')}
              </Button>
            </PopoverTrigger>
            <PopoverContentReadMore side="right" sideOffset={12}>
              <p>
                {t('dashboard.form.emissionEntry.accuracy.readMore.content')}
              </p>
            </PopoverContentReadMore>
          </Popover>
        </div>

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
            errorMessage={form.formState.errors.quantitySource?.message}
          />
        </div>

        <div className="mt-5">
          <EmissionFactorsForm
              key={`${selectedEmissionSourceId}-${form.getValues(
                'emissionSource',
              )}`}
              factors={
                findEmissionSourceById(
                  emissionCategoryWithFactors,
                  form.getValues('emissionSource'),
                )?.factors ?? null
              }
              formType={formType}
              customEmissionFactorDirect={
                formType === 'edit'
                  ? emissionEntry?.attributes.customEmissionFactorDirect ?? null
                  : undefined
              }
              customEmissionFactorIndirect={
                formType === 'edit'
                  ? emissionEntry?.attributes.customEmissionFactorIndirect ??
                    null
                  : undefined
              }
              customEmissionFactorBiogenic={
                formType === 'edit'
                  ? emissionEntry?.attributes.customEmissionFactorBiogenic ??
                    null
                  : undefined
              }
            />
        </div>
        <div className="ml-auto mt-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="link" size="fit" type="button">
                {t('dashboard.form.emissionEntry.emissionFactors.readMore')}
              </Button>
            </PopoverTrigger>
            <PopoverContentReadMore side="right" sideOffset={12}>
              <p>
                {t(
                  'dashboard.form.emissionEntry.emissionFactors.readMore.content',
                )}
              </p>
            </PopoverContentReadMore>
          </Popover>
        </div>
        <div className="mt-8 flex justify-between flex-wrap items-center">
          <Button
            type="button"
            variant="link"
            size="fit"
            className="text-lg font-bold"
            onClick={() => onCancel()}
          >
            {formType === 'edit' ? t('forms.cancelChanges') : t('forms.cancel')}
          </Button>
          <Button type="submit" disabled={createEmissionEntryState.isLoading}>
            <span className="text-lg font-bold px-4">
              {formType === 'edit'
                ? t('forms.saveChanges')
                : t('dashboard.form.emissionEntry.saveEmission')}
            </span>
          </Button>
        </div>
        {createEmissionEntryState.isError && (
          <span className="break-normal font-bold text-destructive ml-auto mt-2">
            {t('api.error.genericWhileCreatingEmissionEntry')}
          </span>
        )}
        {updateEmissionEntryState.isError && (
          <span className="break-normal font-bold text-destructive ml-auto mt-2">
            {t('api.error.genericWhileEditingEmissionEntry')}
          </span>
        )}
      </form>
    </FormProvider>
  );
}
