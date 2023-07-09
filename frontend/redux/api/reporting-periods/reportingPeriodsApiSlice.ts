import { createEntityAdapter } from '@reduxjs/toolkit';

import { apiSlice } from '@/redux/api/apiSlice';
import { ReportingPeriod } from '@/types/reporting-period';

const reportingPeriodsAdapter = createEntityAdapter();

const initialState = reportingPeriodsAdapter.getInitialState();

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

export type CreateReportingPeriodData = {
  organization: number;
  name: string;
  startDate: string;
  endDate: string;
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
      }
    ),
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
  }),
});

export const {
  useGetReportingPeriodsByOrganizationQuery,
  useCreateReportingPeriodMutation,
} = reportingPeriodsApiSlice;
