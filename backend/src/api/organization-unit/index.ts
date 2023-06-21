import { ApiServiceEntry } from "../api.types";
import { EmissionEntry } from "../emission-entry";
import { Organization } from "../organization";
import { OrganizationDivider } from "../organization-divider";

interface DividerValue {
  value: number;
  organizationDivider?: OrganizationDivider;
}

export interface OrganizationUnit extends ApiServiceEntry {
  name: string;
  organization?: Organization;
  emissionEntries?: EmissionEntry[];
  dividerValues?: DividerValue[];
}
