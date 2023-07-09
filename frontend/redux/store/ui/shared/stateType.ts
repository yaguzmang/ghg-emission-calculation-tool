export type SharedUIState = {
  selectedFormOrganizationId: number | undefined;
  selectedFormReportingPeriodId: number | undefined;
  selectedResultsOrganizationId: number | undefined;
  selectedResultsReportingPeriodId: number | undefined;
  selectedLocale: string | undefined;
};

enum OrganizationAndReportingPeriodSections {
  form = 'form',
  results = 'results',
}
export type OrganizationAndReportingPeriodSection =
  `${OrganizationAndReportingPeriodSections}`;
