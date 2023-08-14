import { createEntityAdapter } from '@reduxjs/toolkit';

import { apiSlice } from '@/redux/api/apiSlice';
import {
  EmissionCategoryFlattenWithEmissions,
  EmissionCategoryFlattenWithSourceGroups,
  EmissionCategoryWithLocalizations,
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

export type EmissionCategoryWithLocalizationsResponse = {
  data: EmissionCategoryWithLocalizations;
};

export const emissionCategoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmissionCategoriesWithEmissions: builder.query<
      EmissionCategoryFlattenWithEmissions[],
      { locale: string; reportingPeriodId: number }
    >({
      query: ({ locale, reportingPeriodId }) =>
        `/emission-categories/with-emissions?locale=${locale}&reportingPeriod=${reportingPeriodId}`,
      transformResponse: (
        responseData: EmissionCategoriesWithEmissionsApiResponse,
      ) => {
        const transformedData = responseData.data;
        emissionCategoriesWithEmissionsAdapter.setAll(
          emissionCategoriesWithEmissionsInitialState,
          transformedData,
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
      { emissionCategoryId: number; reportingPeriodId: number }
    >({
      query: ({ emissionCategoryId, reportingPeriodId }) =>
        `/emission-categories/${emissionCategoryId}/with-emission-factors?reportingPeriod=${reportingPeriodId}`,
      providesTags: (result, _error, _arg) =>
        result
          ? [{ type: 'EmissionCategoryWithFactors', id: result.id }]
          : [{ type: 'EmissionCategoryWithFactors', id: 'LIST' }],
    }),
    getEmissionCategoryWithLocalizations: builder.query<
      EmissionCategoryWithLocalizations,
      number
    >({
      query: (emissionCategoryId) =>
        `/emission-categories/${emissionCategoryId}?populate=localizations`,
      transformResponse: (
        responseData: EmissionCategoryWithLocalizationsResponse,
      ) => responseData.data,
      providesTags: (result, _error, _arg) =>
        result
          ? [{ type: 'ReportingPeriod', id: result.id }]
          : [{ type: 'ReportingPeriod', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetEmissionCategoriesWithEmissionsQuery,
  useGetEmissionCategoriesWithFactorsQuery,
  useGetEmissionCategoryWithLocalizationsQuery,
} = emissionCategoriesApiSlice;
