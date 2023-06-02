import { apiSlice } from '@/redux/api/apiSlice';
import { Locale } from '@/types/locale';

export const localesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLocales: builder.query<Locale[], void>({
      query: () => '/i18n/locales',
      providesTags: (result, _error, _arg) =>
        result
          ? [
              ...result.map((locale) => ({
                type: 'Locale' as const,
                id: locale.id,
              })),
              { type: 'Locale', id: 'LIST' },
            ]
          : [{ type: 'Locale', id: 'LIST' }],
    }),
  }),
});

export const { useGetLocalesQuery } = localesApiSlice;
