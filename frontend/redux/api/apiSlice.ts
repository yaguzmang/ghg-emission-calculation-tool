import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';

const protectedEndpoints = [
  'getUser',
  'getReportingPeriodsByOrganization',
  'getUserOrganizations',
  'getOrganizationUnitsByOrganization',
  'getEmissionFactorDatasetByOrganization',
];

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api`,
    prepareHeaders: async (headers, { endpoint }) => {
      if (protectedEndpoints.includes(endpoint)) {
        const session = await getSession();
        if (session?.user?.jwt) {
          headers.set('Authorization', `Bearer ${session.user.jwt}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: [
    'User',
    'ReportingPeriod',
    'Organization',
    'OrganizationUnit',
    'EmissionFactorDataset',
    'Locale',
    'DashboardEmissionCategory',
    'GeneralSettings',
  ],
  endpoints: () => ({}),
});
