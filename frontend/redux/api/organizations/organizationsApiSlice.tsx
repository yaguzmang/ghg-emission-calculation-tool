import { createEntityAdapter } from '@reduxjs/toolkit';

import { apiSlice } from '@/redux/api/apiSlice';
import { Organization } from '@/types/organization';

export type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export type OrganizationsApiResponse = {
  data: Organization[];
  meta: {
    pagination: Pagination;
  };
};

const organizationsAdapter = createEntityAdapter();

const initialState = organizationsAdapter.getInitialState();

export const organizationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserOrganizations: builder.query<Organization[], void>({
      query: () => '/organizations/',
      transformResponse: (responseData: OrganizationsApiResponse) => {
        const transformedData = responseData.data;
        organizationsAdapter.setAll(initialState, transformedData);
        return transformedData;
      },
      providesTags: (result, _error, _arg) =>
        result
          ? [
              ...result.map((organization) => ({
                type: 'Organization' as const,
                id: organization.id,
              })),
              { type: 'Organization', id: 'LIST' },
            ]
          : [{ type: 'Organization', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetUserOrganizationsQuery,
  useLazyGetUserOrganizationsQuery,
} = organizationsApiSlice;
