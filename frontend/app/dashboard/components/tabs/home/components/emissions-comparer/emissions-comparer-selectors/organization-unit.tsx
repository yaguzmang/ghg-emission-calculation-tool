import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetOrganizationUnitsByOrganizationQuery } from '@/redux/api/organization-units/organizationUnitsApiSlice';
import { useAppDispatch } from '@/redux/store';
import {
  SharedUIActions,
  useSelectedOrganizationId,
} from '@/redux/store/ui/shared';
import { useSelectedOrganizationUnitId } from '@/redux/store/ui/shared/hooks';
import {
  OrganizationAndReportingPeriodSections,
  TOTAL_ORGANIZATION_ID,
} from '@/redux/store/ui/shared/stateType';

export function OrganizationUnitSelector() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const selectedOrganizationIdInForm = useSelectedOrganizationId('form');
  const selectedOrganizationId =
    useSelectedOrganizationId('home') ?? selectedOrganizationIdInForm;
  const selectedOrganizationUnitId = useSelectedOrganizationUnitId('home');

  const organizationUnits = useGetOrganizationUnitsByOrganizationQuery(
    selectedOrganizationId ?? 0,
    { skip: selectedOrganizationId === undefined },
  );

  const organizationUnitsSelectOptions = useMemo(() => {
    const options =
      organizationUnits.currentData?.map((organizationUnit) => ({
        value: organizationUnit.id,
        label: organizationUnit.attributes.name,
      })) ?? [];

    if (options.length > 0) {
      options.push({
        value: TOTAL_ORGANIZATION_ID,
        label: t('dashboard.home.compare.totalOrganization'),
      });
    }

    return options;
  }, [organizationUnits.currentData, t]);
  const handleOrganizationUnitChange = useCallback(
    (selectedValue: string) => {
      const selectedOrganizationUnitId = parseInt(selectedValue, 10);
      dispatch(
        SharedUIActions.setSelectedOrganizationUnitId({
          selectedOrganizationUnitId,
          section: OrganizationAndReportingPeriodSections.home,
        }),
      );
    },
    [dispatch],
  );

  return (
    <div className="flex w-full flex-col gap-8">
      <div>
        <span className="text-xs">
          {t('dashboard.home.compare.chooseUnit')}
        </span>
        <div className="flex flex-row flex-wrap items-center gap-8">
          <Select
            key={organizationUnitsSelectOptions?.[0]?.value ?? -1}
            onValueChange={handleOrganizationUnitChange}
            value={
              selectedOrganizationUnitId !== undefined
                ? selectedOrganizationUnitId.toString()
                : undefined
            }
          >
            <SelectTrigger className="w-[230px] bg-white">
              <SelectValue
                placeholder={t('dashboard.home.compare.chooseUnit')}
              />
            </SelectTrigger>
            <SelectContent className="bg-white">
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
  );
}
