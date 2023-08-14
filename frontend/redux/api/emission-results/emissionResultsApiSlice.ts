import { apiSlice } from '@/redux/api/apiSlice';
import { EmissionResults } from '@/types/emission-result';

export type EmissionResultsApiResponse = {
  data: EmissionResults;
};

export const emissionResultsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmissionsResultsByReportingPeriod: builder.query<
      EmissionResults,
      {
        reportingPeriodId: number;
        locale: string;
      }
    >({
      query: ({ reportingPeriodId, locale }) =>
        `/reporting-periods/${reportingPeriodId}/emissions?locale=${locale}`,
      transformResponse: (responseData: EmissionResultsApiResponse) => {
        const transformedData = responseData.data;
        return transformedData;
      },
      providesTags: ['EmissionsResults'],
    }),
  }),
});

export const { useGetEmissionsResultsByReportingPeriodQuery } =
  emissionResultsApiSlice;
