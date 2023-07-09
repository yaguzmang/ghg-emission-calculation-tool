import type { Draft, PayloadAction } from '@reduxjs/toolkit';
import { createSlice, Reducer } from '@reduxjs/toolkit';

import {
  OrganizationAndReportingPeriodSection,
  SharedUIState,
} from './stateType';

import i18n from '@/i18n/i18n';
import { reportingPeriodsApiSlice } from '@/redux/api/reporting-periods/reportingPeriodsApiSlice';
import { userApiSlice } from '@/redux/api/user/userApiSlice';

const initialState: SharedUIState = {
  selectedFormOrganizationId: undefined,
  selectedFormReportingPeriodId: undefined,
  selectedResultsOrganizationId: undefined,
  selectedResultsReportingPeriodId: undefined,
  selectedLocale: undefined,
};

export const sharedUISlice = createSlice({
  name: 'sharedUI',
  initialState,
  reducers: {
    setSelectedOrganizationId: (
      state: Draft<SharedUIState>,
      action: PayloadAction<{
        selectedOrganizationId: number;
        section: OrganizationAndReportingPeriodSection;
      }>
    ) => {
      const { selectedOrganizationId, section } = action.payload;
      switch (section) {
        case 'form':
          state.selectedFormOrganizationId = selectedOrganizationId;
          break;
        case 'results':
          state.selectedResultsOrganizationId = selectedOrganizationId;
          break;
        default:
      }
    },
    setSelectedReportingPeriodId: (
      state: Draft<SharedUIState>,
      action: PayloadAction<{
        selectedReportingPeriodId: number | undefined;
        section: OrganizationAndReportingPeriodSection;
      }>
    ) => {
      const { selectedReportingPeriodId, section } = action.payload;
      switch (section) {
        case 'form':
          state.selectedFormReportingPeriodId = selectedReportingPeriodId;
          break;
        case 'results':
          state.selectedResultsReportingPeriodId = selectedReportingPeriodId;
          break;
        default:
      }
    },
    setSelectedLocale: (
      state: Draft<SharedUIState>,
      action: PayloadAction<{
        locale: string;
      }>
    ) => {
      const { locale } = action.payload;
      state.selectedLocale = locale;
      i18n.changeLanguage(locale);
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        userApiSlice.endpoints.getUser.matchFulfilled,
        (state, { payload }) => {
          if (state.selectedFormOrganizationId === undefined) {
            const { organizations } = payload;
            if (organizations !== undefined && organizations.length > 0) {
              state.selectedFormOrganizationId = organizations[0].id;
            }
          }
          if (state.selectedResultsOrganizationId === undefined) {
            const { organizations } = payload;
            if (organizations !== undefined && organizations.length > 0) {
              state.selectedResultsOrganizationId = organizations[0].id;
            }
          }
          if (state.selectedLocale === undefined) {
            const { locale } = payload;
            state.selectedLocale = locale;
          }
        }
      )
      .addMatcher(
        reportingPeriodsApiSlice.endpoints.getReportingPeriodsByOrganization
          .matchFulfilled,
        (state, { payload }) => {
          if (state.selectedFormReportingPeriodId === undefined) {
            const reportingPeriods = payload;
            if (reportingPeriods !== undefined && reportingPeriods.length > 0) {
              state.selectedFormReportingPeriodId = reportingPeriods[0].id;
            }
          }
          if (state.selectedResultsReportingPeriodId === undefined) {
            const reportingPeriods = payload;
            if (reportingPeriods !== undefined && reportingPeriods.length > 0) {
              state.selectedResultsReportingPeriodId = reportingPeriods[0].id;
            }
          }
        }
      );
  },
});

export const SharedUIActions = { ...sharedUISlice.actions };

export const sharedUISliceReducer =
  sharedUISlice.reducer as Reducer<SharedUIState>;
