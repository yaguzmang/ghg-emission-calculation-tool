import { OrganizationAndReportingPeriodSection } from '../stateType';

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
