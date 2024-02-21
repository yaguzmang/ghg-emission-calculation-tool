import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { UserWalkthrough } from '../user-walkthrough/user-walkthrough';
import { CreateReportingPeriodForm } from './create-reporting-period-form';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetReportingPeriodsByOrganizationQuery } from '@/redux/api/reporting-periods/reportingPeriodsApiSlice';
import { useGetUserQuery } from '@/redux/api/user/userApiSlice';
import { useAppDispatch } from '@/redux/store';
import {
  SharedUIActions,
  useSelectedOrganizationId,
  useSelectedReportingPeriodId,
} from '@/redux/store/ui/shared';
import {
  OrganizationAndReportingPeriodSection,
  UserWalkthroughStep,
} from '@/redux/store/ui/shared/stateType';

interface OrganizationPeriodFormProps {
  section: OrganizationAndReportingPeriodSection;
}

export function OrganizationPeriodForm({
  section,
}: OrganizationPeriodFormProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [newPeriodFormIsVisible, setNewPeriodFormIsVisible] = useState(false);
  const userData = useGetUserQuery();
  const userOrgs = userData.currentData?.organizations ?? [];
  const selectedOrganizationId = useSelectedOrganizationId(section);
  const selectedReportingPeriodId = useSelectedReportingPeriodId(section);

  const organizationSelectOptions = userOrgs.map((organization) => ({
    value: organization.id,
    label: organization.name,
  }));

  const reportingPeriods = useGetReportingPeriodsByOrganizationQuery(
    selectedOrganizationId ?? 0,
    { skip: selectedOrganizationId === undefined },
  );

  const reportingPeriodOptions =
    reportingPeriods?.currentData !== undefined
      ? reportingPeriods.currentData.map((reportingPeriod) => ({
          value: reportingPeriod.id,
          label: `${reportingPeriod.attributes.startDate} - ${reportingPeriod.attributes.endDate}`,
        }))
      : [];

  const handleOrganizationChange = (selectedValue: string) => {
    const selectedOrganizationId = parseInt(selectedValue, 10);
    dispatch(
      SharedUIActions.setSelectedOrganizationId({
        selectedOrganizationId,
        section,
      }),
    );
    dispatch(
      SharedUIActions.setSelectedReportingPeriodId({
        selectedReportingPeriodId: undefined,
        section,
      }),
    );
  };

  const handleReportingPeriodChange = (selectedValue: string) => {
    const selectedReportingPeriodId = parseInt(selectedValue, 10);
    dispatch(
      SharedUIActions.setSelectedReportingPeriodId({
        selectedReportingPeriodId,
        section,
      }),
    );
  };

  return (
    <div className="flex w-full flex-row flex-wrap gap-8">
      <div className="gap-4">
        <h4 className="uppercase">{t('dashboard.form.organization')}</h4>
        <Select
          key={organizationSelectOptions?.[0]?.value ?? -1}
          onValueChange={handleOrganizationChange}
          value={selectedOrganizationId?.toString()}
        >
          <SelectTrigger className="w-[230px]">
            <SelectValue placeholder={t('dashboard.form.selectOrganization')} />
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
      <div>
        <h4 className="uppercase">{t('dashboard.form.period')}</h4>
        <div className="flex flex-row flex-wrap items-center gap-8">
          <Select
            key={reportingPeriods.currentData?.[0]?.id ?? -1}
            onValueChange={handleReportingPeriodChange}
            value={selectedReportingPeriodId?.toString()}
          >
            <SelectTrigger className="w-[230px]">
              <SelectValue placeholder={t('dashboard.form.selectPeriod')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {reportingPeriodOptions.map((option) => (
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
          <h4 className="uppercase">{t('dashboard.form.or')}</h4>
          <UserWalkthrough isButton step={UserWalkthroughStep.startAPeriod}>
            <Button
              className="min-w-[230px]"
              onClick={() => setNewPeriodFormIsVisible(true)}
              type="button"
            >
              <span className="px-4 font-bold">
                {t('dashboard.form.startNewPeriod')}
              </span>
            </Button>
          </UserWalkthrough>
        </div>
      </div>

      {newPeriodFormIsVisible && (
        <CreateReportingPeriodForm
          setFormVisible={setNewPeriodFormIsVisible}
          organizationId={selectedOrganizationId}
          section={section}
        />
      )}
    </div>
  );
}
