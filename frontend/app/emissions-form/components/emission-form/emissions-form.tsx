'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import EmissionFactorsForm from './emission-factors-form';

import { FormCombobox } from '@/components/form/form-combobox';
import FormInput from '@/components/form/form-input';
import { Button } from '@/components/ui/button';
import {
  ArrowReadMore,
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
    message:
      'dashboard.form.emissionEntry.emissionFactors.value.error.positive',
  }),
  source: z.string().min(1, {
    message: 'dashboard.form.emissionEntry.emissionFactors.source.error.input',
  }),
});

const EmissionEntrySchema: z.ZodType<CreateEmissionEntryData> = z.object({
  organizationUnit: z.coerce
    .number({
      invalid_type_error:
        'dashboard.form.emissionEntry.organizationUnit.error.select',
    })
    .int()
    .positive({
      message: 'dashboard.form.emissionEntry.organizationUnit.error.select',
    }),
  reportingPeriod: z.coerce
    .number({
      invalid_type_error:
        'dashboard.form.emissionEntry.reportingPeriod.error.select',
    })
    .int()
    .positive({
      message: 'dashboard.form.emissionEntry.reportingPeriod.error.select',
    }),
  emissionSource: z.coerce
    .number({
      invalid_type_error:
        'dashboard.form.emissionEntry.emissionSource.error.select',
    })
    .int()
    .positive({
      message: 'dashboard.form.emissionEntry.emissionSource.error.select',
    }),
  quantity: z.coerce
    .number({
      invalid_type_error: 'dashboard.form.emissionEntry.quantity.error.valid',
    })
    .nonnegative({
      message: 'dashboard.form.emissionEntry.quantity.error.valid',
    }),
  tier: z.coerce
    .number({
      invalid_type_error: 'dashboard.form.emissionEntry.tier.error.select',
    })
    .int()
    .nonnegative({
      message: 'dashboard.form.emissionEntry.tier.error.select',
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
  scrollIntoView?: boolean;
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
  scrollIntoView = false,
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

  const emissionQuantityLabel =
    emissionCategoryWithFactors.quantityLabel !== null
      ? emissionCategoryWithFactors.quantityLabel
      : t('dashboard.form.emissionEntry.quantity');

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

  const selectedEmissionSource = findEmissionSourceById(
    emissionCategoryWithFactors,
    form.getValues('emissionSource'),
  );

  const isSourceEEIO = selectedEmissionSource?.unit === '€';

  useEffect(() => {
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
  }, [isSourceEEIO, emissionEntry?.attributes?.tier, form, formType]);

  const formRef = useRef<HTMLFormElement>(null);
  const [scrolledIntoView, setScrolledIntoview] = useState(false);

  useEffect(() => {
    if (!scrollIntoView || !formRef.current || !document) {
      return;
    }
    if (scrolledIntoView) {
      return;
    }
    formRef.current.scrollIntoView({ behavior: 'smooth' });
    setScrolledIntoview(true);
  }, [formRef, scrolledIntoView, scrollIntoView]);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col"
        ref={formRef}
      >
        <FormInput
          type="hidden"
          id="reportingPeriod"
          value={reportingPeriodId ?? -1}
          errorMessage={
            form.formState?.errors?.reportingPeriod?.message !== undefined
              ? t(form.formState.errors.reportingPeriod.message)
              : undefined
          }
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
              {form.formState?.errors?.organizationUnit?.message !== undefined
                ? t(form.formState.errors.organizationUnit.message)
                : undefined}
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

        <div className="mt-10 flex justify-between flex-wrap gap-y-6">
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
                formType === 'edit'
                  ? emissionEntry?.attributes?.tier
                  : undefined
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
            <span className="text-sm text-destructive basis-full">
              {t(form.formState.errors.tier.message)}
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
            <PopoverContentReadMore side="bottom" sideOffset={12}>
              <p>
                {t('dashboard.form.emissionEntry.accuracy.readMore.content')}
              </p>
              <ArrowReadMore />
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
            errorMessage={
              form.formState?.errors?.quantitySource?.message !== undefined
                ? t(form.formState.errors.quantitySource.message)
                : undefined
            }
          />
        </div>

        <div className="mt-5">
          <EmissionFactorsForm
            key={`${selectedEmissionSourceId}-${form.getValues(
              'emissionSource',
            )}`}
            factors={selectedEmissionSource?.factors ?? null}
            formType={formType}
            customEmissionFactorDirect={
              formType === 'edit'
                ? emissionEntry?.attributes.customEmissionFactorDirect ?? null
                : undefined
            }
            customEmissionFactorIndirect={
              formType === 'edit'
                ? emissionEntry?.attributes.customEmissionFactorIndirect ?? null
                : undefined
            }
            customEmissionFactorBiogenic={
              formType === 'edit'
                ? emissionEntry?.attributes.customEmissionFactorBiogenic ?? null
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
            <PopoverContentReadMore side="bottom" sideOffset={12}>
              <p>
                {t(
                  'dashboard.form.emissionEntry.emissionFactors.readMore.content',
                )}
              </p>
              <ArrowReadMore />
            </PopoverContentReadMore>
          </Popover>
        </div>
        <div className="mt-8 flex justify-between flex-wrap items-center gap-y-6">
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
