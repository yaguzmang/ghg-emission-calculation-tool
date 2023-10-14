import type Strapi from "@strapi/types";
import { ApiServiceEntry } from "../api.types";
import { EmissionEntry } from "../emission-entry";
import { Organization } from "../organization";

export interface ReportingPeriod extends ApiServiceEntry {
  startDate: Strapi.EntityService.Params.Attribute.DateValue;
  endDate: Strapi.EntityService.Params.Attribute.DateValue;
  organization?: Organization;
  emissionEntries?: EmissionEntry[];
}
