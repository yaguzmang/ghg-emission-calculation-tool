import { createEntityAdapter } from '@reduxjs/toolkit';

import { apiSlice } from '@/redux/api/apiSlice';
import {
  CreateReportingPeriodData,
  ReportingPeriod,
} from '@/types/reporting-period';

const reportingPeriodsAdapter = createEntityAdapter();

const initialState = reportingPeriodsAdapter.getInitialState();

export type ReportingPeriodApiResponse = {
  data: ReportingPeriod;
};

export type ReportingPeriodsApiResponse = {
  data: {
    id: number;
    attributes: {
      name: string;
      createdAt: string;
      updatedAt: string;
      reportingPeriods: {
        data: ReportingPeriod[];
      };
    };
  };
};

export const reportingPeriodsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReportingPeriodsByOrganization: builder.query<ReportingPeriod[], number>(
      {
        query: (orgazationId) =>
          `/organizations/${orgazationId}?populate=reportingPeriods`,
        transformResponse: (responseData: ReportingPeriodsApiResponse) => {
          const transformedData =
            responseData.data.attributes.reportingPeriods.data;
          reportingPeriodsAdapter.setAll(initialState, transformedData);
          return transformedData;
        },
        providesTags: (result, _error, _arg) =>
          result
            ? [
                ...result.map((reportingPeriod) => ({
                  type: 'ReportingPeriod' as const,
                  id: reportingPeriod.id,
                })),
                { type: 'ReportingPeriod', id: 'LIST' },
              ]
            : [{ type: 'ReportingPeriod', id: 'LIST' }],
      },
    ),
    getReportingPeriod: builder.query<ReportingPeriod, number>({
      query: (reportingPeriodId) => `/reporting-periods/${reportingPeriodId}`,
      transformResponse: (responseData: ReportingPeriodApiResponse) =>
        responseData.data,
      providesTags: (result, _error, _arg) =>
        result
          ? [{ type: 'ReportingPeriod', id: result.id }]
          : [{ type: 'ReportingPeriod', id: 'LIST' }],
    }),
    createReportingPeriod: builder.mutation<
      ReportingPeriodsApiResponse,
      CreateReportingPeriodData
    >({
      query: (reportingPeriodAttributes) => ({
        url: '/reporting-periods',
        method: 'POST',
        body: { data: { ...reportingPeriodAttributes } },
      }),
      invalidatesTags: [{ type: 'ReportingPeriod', id: 'LIST' }],
    }),
    deleteReportingPeriod: builder.mutation<{ data: ReportingPeriod }, number>({
      query: (reportingPeriodId) => ({
        url: `/reporting-periods/${reportingPeriodId}?force=true`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'ReportingPeriod', id: 'LIST' },
        { type: 'EmissionEntry', id: 'LIST' },
        { type: 'EmissionCategoryWithEmissions', id: 'LIST' },
        { type: 'EmissionsResults' },
      ],
    }),
  }),
});

export const {
  useGetReportingPeriodsByOrganizationQuery,
  useCreateReportingPeriodMutation,
  useGetReportingPeriodQuery,
  useDeleteReportingPeriodMutation,
} = reportingPeriodsApiSlice;
