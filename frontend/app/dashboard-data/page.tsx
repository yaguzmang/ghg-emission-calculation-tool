'use client';

import React from 'react';

import { useGetEmissionFactorDatasetByOrganizationQuery } from '@/redux/api/emission-factor-dataset/emissionFactorDatasetApiSlice';
import { useGetOrganizationUnitsByOrganizationQuery } from '@/redux/api/organization-units/organizationUnitsApiSlice';
import { useLazyGetUserOrganizationsQuery } from '@/redux/api/organizations/organizationsApiSlice';
import { useGetReportingPeriodsByOrganizationQuery } from '@/redux/api/reporting-periods/reportingPeriodsApiSlice';
import { useGetUserQuery } from '@/redux/api/user/userApiSlice';
import { useAppDispatch } from '@/redux/store';
import {
  SharedUIActions,
  useSelectedOrganizationId,
} from '@/redux/store/ui/shared';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: number | string | undefined;
  onChange: (value: string) => void;
}

function Select({ options, value, onChange }: SelectProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className="border-2 border-solid border-b-teal-950"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const userData = useGetUserQuery();
  const selectedOrganizationId = useSelectedOrganizationId();

  const userOrgs = userData.currentData?.organizations ?? [];
  const [triggerGetUserOrganizations, { data: userOrganizationsFetched }] =
    useLazyGetUserOrganizationsQuery();

  const organizationSelectOptions = userOrgs.map((organization) => ({
    value: organization.id,
    label: organization.name,
  }));

  const reportingPeriods = useGetReportingPeriodsByOrganizationQuery(
    selectedOrganizationId ?? 0,
    { skip: selectedOrganizationId === undefined }
  );

  const organizationUnits = useGetOrganizationUnitsByOrganizationQuery(
    selectedOrganizationId ?? 0,
    { skip: selectedOrganizationId === undefined }
  );

  const emissionFactorDataset = useGetEmissionFactorDatasetByOrganizationQuery(
    selectedOrganizationId ?? 0,
    { skip: selectedOrganizationId === undefined }
  );

  const handleOrganizationChange = (selectedValue: string) => {
    const selectedOrganizationId = parseInt(selectedValue, 10);
    dispatch(
      SharedUIActions.setSelectedOrganizationId({ selectedOrganizationId })
    );
  };

  return (
    <main>
      <h1 className="bg-green-500 text-2xl underline">DASHBOARD</h1>
      <div>
        {userData && userData.currentData ? (
          <div>
            <h3 className="text-red-700">User data</h3>
            <pre>{JSON.stringify(userData.currentData, null, 2)} </pre>
          </div>
        ) : null}
      </div>
      <div>
        <h3 className="text-red-700">Select organization</h3>
        <Select
          options={organizationSelectOptions}
          value={selectedOrganizationId}
          onChange={handleOrganizationChange}
        />
      </div>

      {reportingPeriods && reportingPeriods.currentData ? (
        <div>
          <h3 className="text-red-700">reportingPeriods data</h3>

          <pre>{JSON.stringify(reportingPeriods.currentData, null, 2)}</pre>
        </div>
      ) : null}

      {organizationUnits && organizationUnits.currentData ? (
        <div>
          <h3 className="text-red-700">organizationUnits data</h3>

          <pre>{JSON.stringify(organizationUnits.currentData, null, 2)}</pre>
        </div>
      ) : null}

      {emissionFactorDataset && emissionFactorDataset.currentData ? (
        <div>
          <h3 className="text-red-700">emissionFactorDataset</h3>

          <pre>
            {JSON.stringify(emissionFactorDataset.currentData, null, 2)}
          </pre>
        </div>
      ) : null}

      <div>
        <h3 className="text-red-700">User fetched organizations</h3>
        <button
          className="border-2 border-solid border-b-teal-950"
          type="button"
          onClick={() => triggerGetUserOrganizations()}
        >
          Fetch organizations for user: {userData.currentData?.username}
        </button>
        {userOrganizationsFetched ? (
          <pre>{JSON.stringify(userOrganizationsFetched, null, 2)}</pre>
        ) : null}
      </div>
    </main>
  );
}
