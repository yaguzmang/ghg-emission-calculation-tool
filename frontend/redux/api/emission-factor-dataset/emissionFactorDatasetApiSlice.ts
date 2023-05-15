import { apiSlice } from '@/redux/api/apiSlice';
import { EmissionFactorDataset } from '@/types/emission-factor-dataset';

export type EmissionFactorDatasetApiResponse = {
  data: {
    id: number;
    attributes: {
      name: string;
      createdAt: string;
      updatedAt: string;
      emissionFactorDataset: {
        data: EmissionFactorDataset;
      };
    };
  };
};

export const emissionFactorDatasetApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmissionFactorDatasetByOrganization: builder.query<
      EmissionFactorDataset,
      number
    >({
      query: (orgazationId) =>
        `/organizations/${orgazationId}?populate=emissionFactorDataset`,
      transformResponse: (responseData: EmissionFactorDatasetApiResponse) => {
        const transformedData =
          responseData.data.attributes.emissionFactorDataset.data;
        return transformedData;
      },
      providesTags: (result, _error, _arg) =>
        result
          ? [{ type: 'EmissionFactorDataset', id: result.id }]
          : [{ type: 'EmissionFactorDataset', id: 'LIST' }],
    }),
  }),
});

export const { useGetEmissionFactorDatasetByOrganizationQuery } =
  emissionFactorDatasetApiSlice;
