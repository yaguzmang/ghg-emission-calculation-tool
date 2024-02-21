import React from 'react';
import { useTranslation } from 'react-i18next';

import { SelectField } from './select-field';

import { ValidateCSVResponse } from '@/redux/api/emission-entries/validateCsvEntriesHook';
import { useGetOrganizationUnitsByOrganizationQuery } from '@/redux/api/organization-units/organizationUnitsApiSlice';
import { useSelectedOrganizationId } from '@/redux/store/ui/shared/hooks';

interface OrganizationUnitsMapperProps {
  data: ValidateCSVResponse;
  mappedOrganizationIds: Record<string, number>;
  onChangeMappedOrganizationIds: (
    organizationUnitKey: string,
    organizationUnitId: number,
  ) => void;
}

export function OrganizationUnitsMapper({
  data,
  mappedOrganizationIds,
  onChangeMappedOrganizationIds,
}: OrganizationUnitsMapperProps) {
  const { t } = useTranslation();
  const organizationId = useSelectedOrganizationId('form');
  const organizationUnits = useGetOrganizationUnitsByOrganizationQuery(
    organizationId ?? 0,
    { skip: organizationId === undefined },
  );

  const organizationUnitsSelectOptions =
    organizationUnits.currentData?.map((organizationUnit) => ({
      value: organizationUnit.id,
      label: organizationUnit.attributes.name,
    })) ?? [];

  return (
    <div>
      <div className="my-4 self-center justify-self-center">
        <span className="text-base text-black">
          {t('dashboard.form.import.mapper.matchHelpText')}
        </span>
      </div>

      {data.organizationUnitKeys.map((orgUnitKey) => (
        <SelectField
          key={`SelectField-${orgUnitKey}`}
          mappedOrganizationIds={mappedOrganizationIds}
          onChangeMappedOrganizationIds={onChangeMappedOrganizationIds}
          organizationUnitsSelectOptions={organizationUnitsSelectOptions}
          orgUnitKey={orgUnitKey}
        />
      ))}
    </div>
  );
}
