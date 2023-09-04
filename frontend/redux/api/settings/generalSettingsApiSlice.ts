import { apiSlice } from '@/redux/api/apiSlice';

export type GeneralSettingsApiResponse = {
  data: {
    id: number;
    attributes: {
      appName: string;
      createdAt: string;
      updatedAt: string;
      locale: string;
      termsOfServiceLink: {
        id: number;
        label: string;
        url: string;
      } | null;
      userManualLink: {
        id: number;
        label: string;
        url: string;
      } | null;
      landingPageLink: {
        id: number;
        label: string;
        url: string;
      } | null;
    };
  };
};

export const generalSettingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGeneralSettingsByLocale: builder.query<
      GeneralSettingsApiResponse,
      string
    >({
      query: (locale) => `/settings-general?locale=${locale}&populate=*`,
      providesTags: ['GeneralSettings'],
    }),
  }),
});

export const { useGetGeneralSettingsByLocaleQuery } = generalSettingsApiSlice;
