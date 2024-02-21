import { apiSlice } from '@/redux/api/apiSlice';
import { EmissionFactorDataInfo } from '@/types/emission-factor-data';

export type EmissionFactorDataApiResponse = {
  data: EmissionFactorDataInfo[];
};

export const emissionFactorDataApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmissionFactorDataByDatasetIdAndLocale: builder.query<
      EmissionFactorDataInfo[],
      { datasetId: number; locale: string }
    >({
      query: ({ datasetId, locale }) =>
        `/emission-factor-data?fields[0]=year&fields[1]=createdAt&fields[2]=updatedAt&fields[3]=locale&pagination[start]=0&pagination[limit]=1000&locale=${locale}&filters[dataset][id]=${datasetId}`,
      transformResponse: (responseData: EmissionFactorDataApiResponse) => {
        const transformedData = responseData.data;
        return transformedData;
      },
      providesTags: (result, _error, _arg) =>
        result
          ? [{ type: 'EmissionFactorData', id: 'LIST' }]
          : [{ type: 'EmissionFactorData', id: 'LIST' }],
    }),
  }),
});

export const { useGetEmissionFactorDataByDatasetIdAndLocaleQuery } =
  emissionFactorDataApiSlice;
