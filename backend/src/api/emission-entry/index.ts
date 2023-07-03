import type { ApiServiceEntry } from "../api.types";
import type { EmissionSource } from "../emission-source";
import { OrganizationUnit } from "../organization-unit";

interface CustomEmissionFactor {
  value: number;
  source?: string;
}

export interface Emissions {
  direct?: number;
  indirect?: number;
  biogenic?: number;
}

export interface EmissionsAndAccuracies {
  direct?: {
    emissions: number;
    accuracy: number;
  };
  indirect?: {
    emissions: number;
    accuracy: number;
  };
  biogenic?: {
    emissions: number;
    accuracy: number;
  };
}

export interface EmissionEntry extends ApiServiceEntry {
  organizationUnit?: OrganizationUnit;
  emissionSource?: EmissionSource;
  quantity: number;
  tier: 1 | 2 | 3;
  quantitySource?: string;
  customEmissionFactorDirect?: CustomEmissionFactor;
  customEmissionFactorIndirect?: CustomEmissionFactor;
  customEmissionFactorBiogenic?: CustomEmissionFactor;
  emissions?: Emissions;
}
