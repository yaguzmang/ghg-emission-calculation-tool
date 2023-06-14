import { ApiServiceEntry } from "../api.types";
import { EmissionFactorDataset } from "../emission-factor-dataset";
import { ReportingPeriod } from "../reporting-period";

export interface Organization extends ApiServiceEntry {
  name: string;
  users?: ApiServiceEntry[];
  organizationUnits?: ApiServiceEntry[];
  reportingPeriods?: ReportingPeriod[];
  emissionFactorDataset?: EmissionFactorDataset;
}
