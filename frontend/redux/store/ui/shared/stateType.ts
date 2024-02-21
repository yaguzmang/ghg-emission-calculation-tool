// User Walkthrough Steps in order
export enum UserWalkthroughStep {
  welcome = 'welcome',
  openPeriodSettings = 'openPeriodSettings',
  startAPeriod = 'startAPeriod',
  selectAFormCategory = 'selectAFormCategory',
  formInformation = 'formInformation',
  formStatisticsInformation = 'formStatisticsInformation',
  resultsPageInformation = 'resultsPageInformation',
  finished = 'finished',
}

export type UserWalkthroughState = {
  enabled?: boolean;
  step?: UserWalkthroughStep;
};

export type SharedUIState = {
  selectedFormOrganizationId: number | undefined;
  selectedFormReportingPeriodId: number | undefined;
  selectedResultsOrganizationId: number | undefined;
  selectedResultsReportingPeriodId: number | undefined;
  selectedLocale: string | undefined;
  selectedHomeOrganizationId: number | undefined;
  selectedHomeOrganizationUnitId: number | undefined;
  selectedHomeEmissionCategoryId: number | undefined;
  dashboardTab: DashboardTab | undefined;
  userWalkthrough: UserWalkthroughState | undefined;
};

export const TOTAL_ORGANIZATION_ID = -1;
export const TOTAL_ALL_EMISSIONS = -1;

export enum OrganizationAndReportingPeriodSections {
  form = 'form',
  results = 'results',
  home = 'home',
}
export type OrganizationAndReportingPeriodSection =
  `${OrganizationAndReportingPeriodSections}`;

export enum DashboardTab {
  home = 'home',
  inventory = 'inventory',
  results = 'results',
}
