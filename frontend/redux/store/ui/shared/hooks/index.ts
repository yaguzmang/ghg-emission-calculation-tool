import {
  DashboardTab,
  OrganizationAndReportingPeriodSection,
  UserWalkthroughState,
} from '../stateType';

import { useAppSelector } from '@/redux/store';

export const useSelectedOrganizationId = (
  section: OrganizationAndReportingPeriodSection,
): number | undefined =>
  useAppSelector((state) => {
    switch (section) {
      case 'form':
        return state.ui?.shared.selectedFormOrganizationId;
      case 'results':
        return state.ui?.shared.selectedResultsOrganizationId;
      case 'home':
        return state.ui?.shared.selectedHomeOrganizationId;
      default:
        return undefined;
    }
  });

export const useSelectedOrganizationUnitId = (
  section: OrganizationAndReportingPeriodSection,
): number | undefined =>
  useAppSelector((state) => {
    switch (section) {
      case 'home':
        return state.ui?.shared.selectedHomeOrganizationUnitId;
      default:
        return undefined;
    }
  });

export const useSelectedEmissionCategoryId = (
  section: OrganizationAndReportingPeriodSection,
): number | undefined =>
  useAppSelector((state) => {
    switch (section) {
      case 'home':
        return state.ui?.shared.selectedHomeEmissionCategoryId;
      default:
        return undefined;
    }
  });

export const useSelectedReportingPeriodId = (
  section: OrganizationAndReportingPeriodSection,
): number | undefined =>
  useAppSelector((state) => {
    switch (section) {
      case 'form':
        return state.ui?.shared.selectedFormReportingPeriodId;
      case 'results':
        return state.ui?.shared.selectedResultsReportingPeriodId;
      default:
        return undefined;
    }
  });

export const useSelectedLocale = (): string | undefined =>
  useAppSelector((state) => state.ui?.shared.selectedLocale);

export const useDashboardTab = (): DashboardTab | undefined =>
  useAppSelector((state) => state.ui?.shared.dashboardTab);

export const useUserWalkthrough = (): UserWalkthroughState | undefined =>
  useAppSelector((state) => state.ui?.shared.userWalkthrough);
