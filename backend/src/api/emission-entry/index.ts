import type { ApiServiceEntry } from "../api.types";
import type { EmissionSource } from "../emission-source";

interface CustomEmissionFactor {
  value: number;
  source?: string;
}

export interface Emissions {
  direct?: number;
  indirect?: number;
  biogenic?: number;
}

export interface EmissionEntry extends ApiServiceEntry {
  emissionSource?: EmissionSource;
  quantity: number;
  tier: 1 | 2 | 3;
  quantitySource?: string;
  customEmissionFactorDirect?: CustomEmissionFactor;
  customEmissionFactorIndirect?: CustomEmissionFactor;
  customEmissionFactorBiogenic?: CustomEmissionFactor;
  emissions?: Emissions;
}
