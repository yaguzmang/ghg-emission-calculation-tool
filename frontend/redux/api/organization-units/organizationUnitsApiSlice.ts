import { createEntityAdapter } from '@reduxjs/toolkit';

import { apiSlice } from '@/redux/api/apiSlice';
import {
  OrganizationUnit,
  OrganizationUnitsWithDividerValues,
  OrganizationUnitWithDividerValues,
} from '@/types/organization-unit';

const organizationUnitsAdapter = createEntityAdapter();

const initialState = organizationUnitsAdapter.getInitialState();

export type OrganizationUnisApiResponse = {
  data: {
    id: number;
    attributes: {
      name: string;
      createdAt: string;
      updatedAt: string;
      organizationUnits: {
        data: OrganizationUnit[];
      };
    };
  };
  meta: Record<string, unknown>;
};

export type OrganizationUnitsWithDividerValuesApiResponse = {
  data: OrganizationUnitsWithDividerValues;
};

export const organizationUnitsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizationUnitsByOrganization: builder.query<
      OrganizationUnit[],
      number
    >({
      query: (orgazationId) =>
        `/organizations/${orgazationId}?populate=organizationUnits`,
      transformResponse: (responseData: OrganizationUnisApiResponse) => {
        const transformedData =
          responseData.data.attributes.organizationUnits.data;
        organizationUnitsAdapter.setAll(initialState, transformedData);
        return transformedData;
      },
      providesTags: (result, _error, _arg) =>
        result
          ? [
              ...result.map((organizationUnit) => ({
                type: 'OrganizationUnit' as const,
                id: organizationUnit.id,
              })),
              { type: 'OrganizationUnit', id: 'LIST' },
            ]
          : [{ type: 'OrganizationUnit', id: 'LIST' }],
    }),
    getOrganizationUnitsWithDividerValuesByOrganization: builder.query<
      OrganizationUnitWithDividerValues[],
      number
    >({
      query: (orgazationId) =>
        `/organizations/${orgazationId}?populate[organizationUnits][populate][dividerValues][populate]=organizationDivider`,
      transformResponse: (
        responseData: OrganizationUnitsWithDividerValuesApiResponse,
      ) => {
        const transformedData =
          responseData.data.attributes.organizationUnits.data;
        organizationUnitsAdapter.setAll(initialState, transformedData);
        return transformedData;
      },
      providesTags: (result, _error, _arg) =>
        result
          ? [
              ...result.map((organizationUnit) => ({
                type: 'OrganizationUnit' as const,
                id: organizationUnit.id,
              })),
              { type: 'OrganizationUnit', id: 'LIST' },
              { type: 'OrganizationDivider', id: 'LIST' },
            ]
          : [
              { type: 'OrganizationUnit', id: 'LIST' },
              { type: 'OrganizationDivider', id: 'LIST' },
            ],
    }),
  }),
});

export const {
  useGetOrganizationUnitsByOrganizationQuery,
  useGetOrganizationUnitsWithDividerValuesByOrganizationQuery,
} = organizationUnitsApiSlice;
