import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SelectFieldProps {
  mappedOrganizationIds: Record<string, number>;
  onChangeMappedOrganizationIds: (
    organizationUnitKey: string,
    organizationUnitId: number,
  ) => void;
  organizationUnitsSelectOptions: Array<{
    value: number;
    label: string;
  }>;
  orgUnitKey: string;
}

export function SelectField({
  mappedOrganizationIds,
  onChangeMappedOrganizationIds,
  organizationUnitsSelectOptions,
  orgUnitKey,
}: SelectFieldProps) {
  const { t } = useTranslation();

  return (
    <div>
      <div
        key={orgUnitKey}
        className="flex flex-wrap gap-y-4 rounded-[5px] bg-file px-2 py-4 text-black sm:px-8"
      >
        <div className="flex flex-1 flex-col gap-y-3">
          <span className="text-xs">
            {t('dashboard.form.import.mapper.nameInFile')}
          </span>
          <span className="text-sm font-bold text-secondary">{orgUnitKey}</span>
        </div>
        <div className="flex flex-1 justify-around">
          <div className="flex flex-col gap-y-1 justify-self-center">
            <span className="text-xs">{`${t(
              'dashboard.form.emissionEntry.organizationUnit.choose',
            )} *`}</span>
            <Select
              key={organizationUnitsSelectOptions?.[0]?.value ?? -1}
              onValueChange={(selectedValue: string) => {
                const newSelectedOrganizationUnitId = parseInt(
                  selectedValue,
                  10,
                );
                onChangeMappedOrganizationIds(
                  orgUnitKey,
                  newSelectedOrganizationUnitId,
                );
              }}
              value={mappedOrganizationIds[orgUnitKey]?.toString()}
            >
              <SelectTrigger className="w-[230px] bg-white">
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
          </div>
        </div>
      </div>
    </div>
  );
}
