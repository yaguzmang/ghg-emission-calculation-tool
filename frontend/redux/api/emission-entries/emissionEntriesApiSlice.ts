import { createEntityAdapter } from '@reduxjs/toolkit';

import { apiSlice } from '@/redux/api/apiSlice';
import { EmissionEntryWithOrganizationUnitAndEmissionSource } from '@/types/emission-entry';
import { ReportingPeriodWithEmissionEntries } from '@/types/reporting-period';

const emissionEntriesAdapter = createEntityAdapter();

const initialState = emissionEntriesAdapter.getInitialState();

export type EmissionEntryApiResponse = {
  data: {
    id: number;
    attributes: {
      quantity: number;
      tier: number;
      quantitySource: string;
      createdAt: string;
      updatedAt: string;
    };
  };
};

export type ReportingPeriodWithEmissionEntriesApiResponse = {
  data: ReportingPeriodWithEmissionEntries;
};

export type CustomEmissionFactor = {
  value: number;
  source?: string;
};

export type CreateEmissionEntryData = {
  organizationUnit: number;
  reportingPeriod: number;
  emissionSource: number;
  label?: string;
  quantity: number;
  tier: number;
  quantitySource?: string;
  customEmissionFactorDirect?: CustomEmissionFactor | null;
  customEmissionFactorIndirect?: CustomEmissionFactor | null;
  customEmissionFactorBiogenic?: CustomEmissionFactor | null;
};

export type UpdateEmissionEntryData = {
  organizationUnit?: number;
  reportingPeriod?: number;
  emissionSource?: number;
  quantity?: number;
  tier?: number;
  label?: string;
  quantitySource?: string;
  customEmissionFactorDirect?: CustomEmissionFactor | null;
  customEmissionFactorIndirect?: CustomEmissionFactor | null;
  customEmissionFactorBiogenic?: CustomEmissionFactor | null;
};

export const emissionEntriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmissionEntriesByReportingPeriod: builder.query<
      EmissionEntryWithOrganizationUnitAndEmissionSource[],
      number
    >({
      query: (reportingPeriodId) =>
        `/reporting-periods/${reportingPeriodId}?populate[emissionEntries][populate][0]&populate[emissionEntries][populate][organizationUnit]=organizationUnit&populate[emissionEntries][populate][customEmissionFactorDirect]=customEmissionFactorDirect&populate[emissionEntries][populate][customEmissionFactorIndirect]=customEmissionFactorIndirect&populate[emissionEntries][populate][customEmissionFactorBiogenic]=customEmissionFactorBiogenic&populate[emissionEntries][populate][emissionSource][populate][0]=emissionCategory`,
      transformResponse: (
        responseData: ReportingPeriodWithEmissionEntriesApiResponse,
      ) => {
        const transformedData =
          responseData.data.attributes.emissionEntries.data;
        emissionEntriesAdapter.setAll(initialState, transformedData);
        return transformedData;
      },
      providesTags: (result, _error, _arg) =>
        result
          ? [
              ...result.map((reportingPeriod) => ({
                type: 'EmissionEntry' as const,
                id: reportingPeriod.id,
              })),
              { type: 'EmissionEntry', id: 'LIST' },
            ]
          : [{ type: 'EmissionEntry', id: 'LIST' }],
    }),
    createEmissionEntry: builder.mutation<
      EmissionEntryApiResponse,
      CreateEmissionEntryData
    >({
      query: (emissionEntryAttributes) => ({
        url: '/emission-entries',
        method: 'POST',
        body: { data: { ...emissionEntryAttributes } },
      }),
      invalidatesTags: [
        { type: 'EmissionEntry', id: 'LIST' },
        { type: 'EmissionCategoryWithEmissions', id: 'LIST' },
        { type: 'EmissionsResults' },
      ],
    }),
    updateEmissionEntry: builder.mutation<
      EmissionEntryApiResponse,
      {
        emisionEntryId: number;
        emissionEntryAttributes: UpdateEmissionEntryData;
      }
    >({
      query: ({ emisionEntryId, emissionEntryAttributes }) => ({
        url: `/emission-entries/${emisionEntryId}`,
        method: 'PUT',
        body: { data: { ...emissionEntryAttributes } },
      }),
      invalidatesTags: [
        { type: 'EmissionEntry', id: 'LIST' },
        { type: 'EmissionCategoryWithEmissions', id: 'LIST' },
        { type: 'EmissionsResults' },
      ],
    }),
    deleteEmissionEntry: builder.mutation<EmissionEntryApiResponse, number>({
      query: (emisionEntryId) => ({
        url: `/emission-entries/${emisionEntryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'EmissionEntry', id: 'LIST' },
        { type: 'EmissionCategoryWithEmissions', id: 'LIST' },
        { type: 'EmissionsResults' },
      ],
    }),
  }),
});

export const {
  useGetEmissionEntriesByReportingPeriodQuery,
  useCreateEmissionEntryMutation,
  useUpdateEmissionEntryMutation,
  useDeleteEmissionEntryMutation,
} = emissionEntriesApiSlice;
