import { EmissionEntryWithOrganizationUnitAndEmissionSource } from './emission-entry';

export type ReportingPeriod = {
  id: number;
  attributes: {
    startDate: string;
    endDate: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type ReportingPeriodWithEmissionEntries = ReportingPeriod & {
  attributes: {
    emissionEntries: {
      data: EmissionEntryWithOrganizationUnitAndEmissionSource[];
    };
  };
};
