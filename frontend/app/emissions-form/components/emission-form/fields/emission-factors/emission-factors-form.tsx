'use client';

import React, { useState } from 'react';
import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  useFormContext,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import EmissionFactorEntry from './emission-factor-entry';

import { EmissionType } from '@/types/emission';
import { CustomEmissionFactor } from '@/types/emission-factor';

type EmissionFactor = {
  value?: number;
  data_source: {
    description?: string;
    url?: string;
  };
};

type EmissionFactorsFormProps = {
  factors: {
    direct: EmissionFactor;
    indirect: EmissionFactor;
    biogenic: EmissionFactor;
  } | null;
  formType: 'create' | 'edit';
  customEmissionFactorDirect: CustomEmissionFactor | null | undefined;
  customEmissionFactorIndirect: CustomEmissionFactor | null | undefined;
  customEmissionFactorBiogenic: CustomEmissionFactor | null | undefined;
};

export default function EmissionFactorsForm({
  factors,
  formType,
  customEmissionFactorDirect,
  customEmissionFactorIndirect,
  customEmissionFactorBiogenic,
}: EmissionFactorsFormProps) {
  const { t } = useTranslation();
  const { unregister, setValue, trigger, formState } = useFormContext();
  const customEmissionFactorFieldNameMap = {
    direct: 'customEmissionFactorDirect',
    indirect: 'customEmissionFactorIndirect',
    biogenic: 'customEmissionFactorBiogenic',
  };

  const getCurrentValueDefault = (
    emissionType: EmissionType,
    customEmissionFactor: CustomEmissionFactor | null | undefined,
  ) => {
    let defaultCurrentValue = factors?.[emissionType].value?.toString() ?? '0';
    if (formType === 'edit' && customEmissionFactor) {
      defaultCurrentValue = customEmissionFactor.value.toString();
    }
    return defaultCurrentValue;
  };

  const [emissionFactors, setEmissionFactors] = useState({
    direct: {
      originalValue: factors?.direct?.value?.toString() ?? '0',
      currentValue: getCurrentValueDefault(
        'direct',
        customEmissionFactorDirect,
      ),
      source: customEmissionFactorDirect?.source ?? '',
      isEdited:
        customEmissionFactorDirect !== null &&
        customEmissionFactorDirect !== undefined,
      isEditing: false,
    },
    indirect: {
      originalValue: factors?.indirect.value?.toString() ?? '0',
      currentValue: getCurrentValueDefault(
        'indirect',
        customEmissionFactorIndirect,
      ),
      source: customEmissionFactorIndirect?.source ?? '',
      isEdited:
        customEmissionFactorIndirect !== null &&
        customEmissionFactorIndirect !== undefined,
      isEditing: false,
    },
    biogenic: {
      originalValue: factors?.biogenic.value?.toString() ?? '0',
      currentValue: getCurrentValueDefault(
        'biogenic',
        customEmissionFactorBiogenic,
      ),
      source: customEmissionFactorBiogenic?.source ?? '',
      isEdited:
        customEmissionFactorBiogenic !== null &&
        customEmissionFactorBiogenic !== undefined,
      isEditing: false,
    },
  });

  const handleEmissionFactorValueChange = (
    emissionType: EmissionType,
    newValue: string,
  ) => {
    setEmissionFactors((prevFactors) => ({
      ...prevFactors,
      [emissionType]: {
        ...prevFactors[emissionType],
        currentValue: newValue,
        isEdited: true,
      },
    }));
    setValue(
      `${customEmissionFactorFieldNameMap[emissionType]}.value`,
      newValue,
    );
    trigger(`${customEmissionFactorFieldNameMap[emissionType]}.value`);
  };

  const handleEmissionFactorSourceChange = (
    emissionType: EmissionType,
    newSource: string,
  ) => {
    setEmissionFactors((prevFactors) => ({
      ...prevFactors,
      [emissionType]: {
        ...prevFactors[emissionType],
        source: newSource,
      },
    }));
    setValue(
      `${customEmissionFactorFieldNameMap[emissionType]}.source`,
      newSource,
    );
    setValue(
      `${customEmissionFactorFieldNameMap[emissionType]}.value`,
      emissionFactors[emissionType].currentValue,
    );
    trigger(`${customEmissionFactorFieldNameMap[emissionType]}`);
  };

  const handleOpenEdit = (emissionType: EmissionType) => {
    setEmissionFactors((prevFactors) => ({
      ...prevFactors,
      [emissionType]: {
        ...prevFactors[emissionType],
        isEditing: true,
        isEdited: true,
      },
    }));
    setValue(
      `${customEmissionFactorFieldNameMap[emissionType]}.source`,
      emissionFactors[emissionType].source,
    );
    setValue(
      `${customEmissionFactorFieldNameMap[emissionType]}.value`,
      emissionFactors[emissionType].currentValue,
    );
  };

  const handleUndoEdit = (emissionType: EmissionType) => {
    setEmissionFactors((prevFactors) => ({
      ...prevFactors,
      [emissionType]: {
        ...prevFactors[emissionType],
        currentValue: prevFactors[emissionType].originalValue,
        isEdited: false,
        isEditing: false,
      },
    }));
    // User undoes previously added custom factor, so it needs to be set to null
    if (formType === 'edit') {
      setValue(`${customEmissionFactorFieldNameMap[emissionType]}`, null);
    } else if (formType === 'create') {
      unregister(`${customEmissionFactorFieldNameMap[emissionType]}`);
    }
  };

  const handleSaveEdit = (emissionType: EmissionType) => {
    setEmissionFactors((prevFactors) => {
      const parsedCurrentValue = parseFloat(
        prevFactors[emissionType].currentValue,
      ).toString();
      setValue(
        `${customEmissionFactorFieldNameMap[emissionType]}.value`,
        parsedCurrentValue,
      );
      setValue(
        `${customEmissionFactorFieldNameMap[emissionType]}.source`,
        prevFactors[emissionType].source,
      );
      trigger(`${customEmissionFactorFieldNameMap[emissionType]}`);
      return {
        ...prevFactors,
        [emissionType]: {
          ...prevFactors[emissionType],
          currentValue: parsedCurrentValue,
          isEditing: false,
        },
      };
    });
  };

  return (
    <div className="flex w-full flex-col">
      <span className="basis-full text-sm font-bold">
        {t('dashboard.form.emissionEntry.emissionFactors')}
      </span>
      {formState.errors.organizationUnit?.message?.toString()}
      {Object.entries(emissionFactors).map(([emissionType, factor]) => {
        const valueErrorMessageKey = (
          formState.errors?.[
            customEmissionFactorFieldNameMap[emissionType as EmissionType]
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          ] as Merge<FieldError, FieldErrorsImpl<any>> | undefined
        )?.value?.message as string | undefined;

        const sourceErrorMessageKey = (
          formState.errors?.[
            customEmissionFactorFieldNameMap[emissionType as EmissionType]
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          ] as Merge<FieldError, FieldErrorsImpl<any>> | undefined
        )?.source?.message as string | undefined;

        return (
          <EmissionFactorEntry
            key={emissionType}
            label={t(
              `dashboard.form.emissionEntry.emissionFactors.${emissionType}`,
            )}
            value={
              factor.isEdited
                ? factor.currentValue.toString()
                : factor.originalValue.toString()
            }
            source={factor.source}
            isValueEdited={factor.isEdited}
            isEditing={factor.isEditing}
            emissionType={emissionType as EmissionType}
            valueErrorMessage={
              valueErrorMessageKey !== undefined
                ? t(valueErrorMessageKey)
                : null
            }
            sourceErrorMessage={
              sourceErrorMessageKey !== undefined
                ? t(sourceErrorMessageKey)
                : null
            }
            onValueEdit={handleEmissionFactorValueChange}
            onSourceEdit={handleEmissionFactorSourceChange}
            onUndoEdit={handleUndoEdit}
            onOpenEdit={handleOpenEdit}
            onSaveEdit={handleSaveEdit}
          />
        );
      })}
    </div>
  );
}
