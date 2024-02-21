import { useTranslation } from 'react-i18next';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetUserQuery } from '@/redux/api/user/userApiSlice';
import { useAppDispatch } from '@/redux/store';
import {
  SharedUIActions,
  useSelectedOrganizationId,
} from '@/redux/store/ui/shared';
import { OrganizationAndReportingPeriodSections } from '@/redux/store/ui/shared/stateType';

export function OrganizationSelector() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const selectedOrganizationIdInForm = useSelectedOrganizationId('form');
  const selectedOrganizationId =
    useSelectedOrganizationId('home') ?? selectedOrganizationIdInForm;

  const userData = useGetUserQuery();
  const userOrgs = userData.currentData?.organizations ?? [];

  const organizationSelectOptions = userOrgs.map((organization) => ({
    value: organization.id,
    label: organization.name,
  }));

  const handleOrganizationChange = (selectedValue: string) => {
    const selectedOrganizationId = parseInt(selectedValue, 10);
    dispatch(
      SharedUIActions.setSelectedOrganizationId({
        selectedOrganizationId,
        section: OrganizationAndReportingPeriodSections.home,
      }),
    );
    dispatch(
      SharedUIActions.setSelectedOrganizationUnitId({
        selectedOrganizationUnitId: undefined,
        section: OrganizationAndReportingPeriodSections.home,
      }),
    );
  };

  return (
    <div className="gap-4">
      <span className="text-xs">
        {t('dashboard.home.compare.chooseOrganization')}
      </span>
      <Select
        key={organizationSelectOptions?.[0]?.value ?? -1}
        onValueChange={handleOrganizationChange}
        value={selectedOrganizationId?.toString()}
      >
        <SelectTrigger className="w-[230px] bg-white">
          <SelectValue
            placeholder={t('dashboard.home.compare.chooseOrganization')}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {organizationSelectOptions.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
