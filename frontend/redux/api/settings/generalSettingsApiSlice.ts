import { apiSlice } from '@/redux/api/apiSlice';

export type GeneralSettingsApiResponse = {
  data: {
    id: number;
    attributes: {
      appName: string;
      createdAt: string;
      updatedAt: string;
      locale: string;
    };
  };
};

export const generalSettingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGeneralSettingsByLocale: builder.query<
      GeneralSettingsApiResponse,
      string
    >({
      query: (locale) => `/settings-general?locale=${locale}`,
      providesTags: ['GeneralSettings'],
    }),
  }),
});

export const { useGetGeneralSettingsByLocaleQuery } = generalSettingsApiSlice;
