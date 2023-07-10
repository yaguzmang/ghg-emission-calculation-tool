import { createEntityAdapter } from '@reduxjs/toolkit';

import { apiSlice } from '@/redux/api/apiSlice';
import { EmissionCategory } from '@/types/emission-category';

const dashboardEmissionCategoriesAdapter = createEntityAdapter();

const initialState = dashboardEmissionCategoriesAdapter.getInitialState();

export type DashboardEmissionCategoriesApiResponse = {
  data: {
    id: number;
    attributes: {
      name: string;
      createdAt: string;
      updatedAt: string;
      emissionCategories: {
        data: EmissionCategory[];
      };
    };
  };
};

export const dashboardSettingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardEmissionCategoriesByLocale: builder.query<
      EmissionCategory[],
      string
    >({
      query: (locale) =>
        `/settings-dashboard?locale=${locale}&populate=emissionCategories`,
      transformResponse: (
        responseData: DashboardEmissionCategoriesApiResponse,
      ) => {
        const transformedData =
          responseData.data.attributes.emissionCategories.data;
        dashboardEmissionCategoriesAdapter.setAll(
          initialState,
          transformedData,
        );
        return transformedData;
      },
      providesTags: (result, _error, _arg) =>
        result
          ? [
              ...result.map((reportingPeriod) => ({
                type: 'DashboardEmissionCategory' as const,
                id: reportingPeriod.id,
              })),
              { type: 'DashboardEmissionCategory', id: 'LIST' },
            ]
          : [{ type: 'DashboardEmissionCategory', id: 'LIST' }],
    }),
  }),
});

export const { useGetDashboardEmissionCategoriesByLocaleQuery } =
  dashboardSettingsApiSlice;
