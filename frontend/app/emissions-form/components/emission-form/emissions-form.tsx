'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import EmissionFactorsForm from './fields/emission-factors/emission-factors-form';
import EmissionSourceField from './fields/emission-source';
import OrganizationUnitField from './fields/organization-unit';
import QuantityField from './fields/quantity';
import QuantitySourceField from './fields/quantity-source';
import TierField from './fields/tier';

import FormInput from '@/components/form/form-input';
import { Button } from '@/components/ui/button';
import {
  ArrowReadMore,
  Popover,
  PopoverContentReadMore,
  PopoverTrigger,
} from '@/components/ui/popover';
import { findEmissionSourceById } from '@/lib/data/utils';
import {
  useCreateEmissionEntryMutation,
  useUpdateEmissionEntryMutation,
} from '@/redux/api/emission-entries/emissionEntriesApiSlice';
import { EmissionCategoryFlattenWithSourceGroups } from '@/types/emission-category';
import { EmissionEntryWithOrganizationUnitAndEmissionSource } from '@/types/emission-entry';
import { EmissionEntrySchema } from '@/types/emission-entry-form';

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
  // TODO: Handle empty categories

  // Lifting up additional state to re render emission factors form when source changes
  const [selectedEmissionSourceId, setSelectedEmissionSourceId] = useState<
    string | null
  >(null);
  const handleSourceChange = (newSource: string) => {
    setSelectedEmissionSourceId(newSource);
  };

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

        {formType === 'edit' ? (
          <>
            <OrganizationUnitField
              organizationId={organizationId}
              formType={formType}
              emissionEntry={emissionEntry}
            />
            <EmissionSourceField
              formType={formType}
              emissionEntry={emissionEntry}
              emissionCategoryWithFactors={emissionCategoryWithFactors}
              onSourceChange={handleSourceChange}
            />
            <QuantityField
              formType={formType}
              emissionCategoryWithFactors={emissionCategoryWithFactors}
              selectedEmissionSource={selectedEmissionSource}
              emissionEntry={emissionEntry}
            />

            <TierField
              formType={formType}
              selectedEmissionSource={selectedEmissionSource}
              emissionEntry={emissionEntry}
            />
          </>
        ) : (
          <>
            <OrganizationUnitField
              organizationId={organizationId}
              formType={formType}
              emissionEntry={emissionEntry}
            />
            <EmissionSourceField
              formType={formType}
              emissionCategoryWithFactors={emissionCategoryWithFactors}
              onSourceChange={handleSourceChange}
            />
            <QuantityField
              formType={formType}
              emissionCategoryWithFactors={emissionCategoryWithFactors}
              selectedEmissionSource={selectedEmissionSource}
            />
            <TierField
              formType={formType}
              selectedEmissionSource={selectedEmissionSource}
            />
          </>
        )}

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

        {formType === 'edit' ? (
          <QuantitySourceField
            formType={formType}
            emissionEntry={emissionEntry}
          />
        ) : (
          <QuantitySourceField formType={formType} />
        )}

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
