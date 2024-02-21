import type { Draft, PayloadAction } from '@reduxjs/toolkit';
import { createSlice, Reducer } from '@reduxjs/toolkit';

import { LocalStorageEntities, RootState } from '../../RootState';
import {
  DashboardTab,
  OrganizationAndReportingPeriodSection,
  SharedUIState,
  TOTAL_ALL_EMISSIONS,
  TOTAL_ORGANIZATION_ID,
  UserWalkthroughStep,
} from './stateType';

import i18n from '@/i18n/i18n';
import { reportingPeriodsApiSlice } from '@/redux/api/reporting-periods/reportingPeriodsApiSlice';
import { userApiSlice } from '@/redux/api/user/userApiSlice';

const initialState: SharedUIState = {
  selectedFormOrganizationId: undefined,
  selectedFormReportingPeriodId: undefined,
  selectedResultsOrganizationId: undefined,
  selectedResultsReportingPeriodId: undefined,
  selectedLocale: 'et',
  selectedHomeOrganizationId: undefined,
  selectedHomeOrganizationUnitId: TOTAL_ORGANIZATION_ID,
  selectedHomeEmissionCategoryId: TOTAL_ALL_EMISSIONS,
  dashboardTab: undefined,
  userWalkthrough: { enabled: true, step: UserWalkthroughStep.welcome },
};

export const persistSharedUiState = (state: SharedUIState) => {
  const rootState: RootState = {
    ui: {
      shared: state,
    },
  };
  window?.localStorage?.setItem(
    LocalStorageEntities.uiState,
    JSON.stringify(rootState),
  );
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
      }>,
    ) => {
      const { selectedOrganizationId, section } = action.payload;
      switch (section) {
        case 'form':
          state.selectedFormOrganizationId = selectedOrganizationId;
          break;
        case 'results':
          state.selectedResultsOrganizationId = selectedOrganizationId;
          break;
        case 'home':
          state.selectedHomeOrganizationId = selectedOrganizationId;
          break;
        default:
      }
      persistSharedUiState(state);
    },
    setSelectedOrganizationUnitId: (
      state: Draft<SharedUIState>,
      action: PayloadAction<{
        selectedOrganizationUnitId: number | undefined;
        section: OrganizationAndReportingPeriodSection;
      }>,
    ) => {
      const { selectedOrganizationUnitId, section } = action.payload;
      switch (section) {
        case 'home':
          state.selectedHomeOrganizationUnitId = selectedOrganizationUnitId;
          break;
        default:
      }
      persistSharedUiState(state);
    },
    setSelectedEmissionCategoryId: (
      state: Draft<SharedUIState>,
      action: PayloadAction<{
        selectedEmissionCategoryId: number;
        section: OrganizationAndReportingPeriodSection;
      }>,
    ) => {
      const { selectedEmissionCategoryId, section } = action.payload;
      switch (section) {
        case 'home':
          state.selectedHomeEmissionCategoryId = selectedEmissionCategoryId;
          break;
        default:
      }
      persistSharedUiState(state);
    },
    setSelectedReportingPeriodId: (
      state: Draft<SharedUIState>,
      action: PayloadAction<{
        selectedReportingPeriodId: number | undefined;
        section: OrganizationAndReportingPeriodSection;
      }>,
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
      persistSharedUiState(state);
    },
    setSelectedLocale: (
      state: Draft<SharedUIState>,
      action: PayloadAction<{
        locale: string;
      }>,
    ) => {
      const { locale } = action.payload;
      state.selectedLocale = locale;
      i18n.changeLanguage(locale);
      persistSharedUiState(state);
    },
    setDashboardTab: (
      state: Draft<SharedUIState>,
      action: PayloadAction<{
        tab: DashboardTab;
      }>,
    ) => {
      const { tab } = action.payload;
      state.dashboardTab = tab;
      persistSharedUiState(state);
    },
    setUserWalkthroughStep: (
      state: Draft<SharedUIState>,
      action: PayloadAction<{
        step: UserWalkthroughStep;
      }>,
    ) => {
      const { step } = action.payload;
      state.userWalkthrough = { ...state.userWalkthrough, step };
      persistSharedUiState(state);
    },
    setUserWalkthroughEnabled: (
      state: Draft<SharedUIState>,
      action: PayloadAction<{
        enabled: boolean;
      }>,
    ) => {
      const { enabled } = action.payload;
      state.userWalkthrough = { ...state.userWalkthrough, enabled };
      persistSharedUiState(state);
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
          if (state.selectedHomeOrganizationId === undefined) {
            const { organizations } = payload;
            if (organizations !== undefined && organizations.length > 0) {
              state.selectedHomeOrganizationId = organizations[0].id;
            }
          }
          if (state.selectedLocale === undefined) {
            const { locale } = payload;
            state.selectedLocale =
              locale ?? (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as string);
            i18n.changeLanguage(
              locale ?? (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as string),
            );
          }
          persistSharedUiState(state);
        },
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
          persistSharedUiState(state);
        },
      );
  },
});

export const SharedUIActions = { ...sharedUISlice.actions };

export const sharedUISliceReducer =
  sharedUISlice.reducer as Reducer<SharedUIState>;
