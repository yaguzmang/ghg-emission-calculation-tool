import { ApiServiceEntry } from "../api.types";
import { Organization } from "../organization";

export interface OrganizationDivider extends ApiServiceEntry {
  label: string;
  organization?: Organization;
}
