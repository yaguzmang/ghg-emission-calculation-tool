import { LocalizedApiServiceEntry } from "../api.types";
import { Emissions, EmissionsAndAccuracies } from "../emission-entry";
import { EmissionSource } from "../emission-source";

export interface EmissionCategory extends LocalizedApiServiceEntry {
  title: string;
  description?: string;
  emissionGroup?: LocalizedApiServiceEntry;
  emissionSources?: EmissionSource[];
  primaryScope: number;
  emissionSourceLabel?: string;
  localizations?: EmissionCategory[];
  emissions?: Emissions | EmissionsAndAccuracies | number;
  color?: string;
}
