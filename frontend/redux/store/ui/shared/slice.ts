import type { Draft, PayloadAction } from '@reduxjs/toolkit';
import { createSlice, Reducer } from '@reduxjs/toolkit';

import { SharedUIState } from './stateType';

import { reportingPeriodsApiSlice } from '@/redux/api/reporting-periods/reportingPeriodsApiSlice';
import { userApiSlice } from '@/redux/api/user/userApiSlice';

const initialState: SharedUIState = {
  selectedOrganizationId: undefined,
  selectedReportingPeriodId: undefined,
};

export const sharedUISlice = createSlice({
  name: 'sharedUI',
  initialState,
  reducers: {
    setSelectedOrganizationId: (
      state: Draft<SharedUIState>,
      action: PayloadAction<{
        selectedOrganizationId: number;
      }>
    ) => {
      const { selectedOrganizationId } = action.payload;
      state.selectedOrganizationId = selectedOrganizationId;
    },
    setSelectedReportingPeriodId: (
      state: Draft<SharedUIState>,
      action: PayloadAction<{
        selectedOrganizationId: number;
      }>
    ) => {
      const { selectedOrganizationId } = action.payload;
      state.selectedOrganizationId = selectedOrganizationId;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        userApiSlice.endpoints.getUser.matchFulfilled,
        (state, { payload }) => {
          if (state.selectedOrganizationId === undefined) {
            const { organizations } = payload;
            if (organizations !== undefined && organizations.length > 0) {
              state.selectedOrganizationId = organizations[0].id;
            }
          }
        }
      )
      .addMatcher(
        reportingPeriodsApiSlice.endpoints.getReportingPeriodsByOrganization
          .matchFulfilled,
        (state, { payload }) => {
          if (state.selectedReportingPeriodId === undefined) {
            const reportingPeriods = payload;
            if (reportingPeriods !== undefined && reportingPeriods.length > 0) {
              state.selectedReportingPeriodId = reportingPeriods[0].id;
            }
          }
        }
      );
  },
});

export const SharedUIActions = { ...sharedUISlice.actions };

export const sharedUISliceReducer =
  sharedUISlice.reducer as Reducer<SharedUIState>;
