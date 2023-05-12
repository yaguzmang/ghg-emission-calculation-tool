import { apiSlice } from '../api/apiSlice';

import { User } from '@/types/user';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<User, void>({
      query: () => '/users/me?populate=*',
      providesTags: ['User'],
    }),
  }),
});

export const { useGetUserQuery } = userApiSlice;
