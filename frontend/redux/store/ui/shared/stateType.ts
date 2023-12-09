export type SharedUIState = {
  selectedFormOrganizationId: number | undefined;
  selectedFormReportingPeriodId: number | undefined;
  selectedResultsOrganizationId: number | undefined;
  selectedResultsReportingPeriodId: number | undefined;
  selectedLocale: string | undefined;
  selectedHomeOrganizationId: number | undefined;
  selectedHomeOrganizationUnitId: number | undefined;
  selectedHomeEmissionCategoryId: number | undefined;
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
