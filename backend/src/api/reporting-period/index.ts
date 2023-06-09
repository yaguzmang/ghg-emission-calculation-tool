import { ApiServiceEntry } from "../api.types";
import { EmissionEntry } from "../emission-entry";
import { Organization } from "../organization";

export interface ReportingPeriod extends ApiServiceEntry {
  startDate: string;
  endDate: string;
  organization?: Organization;
  emissionEntries?: EmissionEntry[];
}
