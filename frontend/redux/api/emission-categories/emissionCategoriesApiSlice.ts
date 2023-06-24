import { createEntityAdapter } from '@reduxjs/toolkit';

import { apiSlice } from '@/redux/api/apiSlice';
import {
  EmissionCategoryFlattenWithEmissions,
  EmissionCategoryFlattenWithSourceGroups,
} from '@/types/emission-category';

const emissionCategoriesWithEmissionsAdapter = createEntityAdapter();

const emissionCategoriesWithEmissionsInitialState =
  emissionCategoriesWithEmissionsAdapter.getInitialState();

export type EmissionCategoriesWithEmissionsApiResponse = {
  data: EmissionCategoryFlattenWithEmissions[];
};

export type EmissionCategoriesWithFactorsApiResponse = {
  data: EmissionCategoryFlattenWithSourceGroups;
};

export const emissionCategoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmissionCategoriesWithEmissions: builder.query<
      EmissionCategoryFlattenWithEmissions[],
      { locale: string; reportingPeriod: number }
    >({
      query: ({ locale, reportingPeriod }) =>
        `/emission-categories/with-emissions?locale=${locale}&reportingPeriod=${reportingPeriod}`,
      transformResponse: (
        responseData: EmissionCategoriesWithEmissionsApiResponse
      ) => {
        const transformedData = responseData.data;
        emissionCategoriesWithEmissionsAdapter.setAll(
          emissionCategoriesWithEmissionsInitialState,
          transformedData
        );
        return transformedData;
      },
      providesTags: (result, _error, _arg) =>
        result
          ? [
              ...result.map((EmissionCategoryWithEmissions) => ({
                type: 'EmissionCategoryWithEmissions' as const,
                id: EmissionCategoryWithEmissions.id,
              })),
              { type: 'EmissionCategoryWithEmissions', id: 'LIST' },
            ]
          : [{ type: 'EmissionCategoryWithEmissions', id: 'LIST' }],
    }),
    getEmissionCategoriesWithFactors: builder.query<
      EmissionCategoryFlattenWithSourceGroups,
      { emissionCategoryId: number; reportingPeriod: number }
    >({
      query: ({ emissionCategoryId, reportingPeriod }) =>
        `/emission-categories/${emissionCategoryId}/with-emission-factors?reportingPeriod=${reportingPeriod}`,
      providesTags: (result, _error, _arg) =>
        result
          ? [{ type: 'EmissionCategoryWithFactors', id: result.id }]
          : [{ type: 'EmissionCategoryWithFactors', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetEmissionCategoriesWithEmissionsQuery,
  useGetEmissionCategoriesWithFactorsQuery,
} = emissionCategoriesApiSlice;
