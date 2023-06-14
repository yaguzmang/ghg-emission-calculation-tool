import { LocalizedApiServiceEntry } from "../api.types";
import { EmissionSource } from "../emission-source";

export interface EmissionCategory extends LocalizedApiServiceEntry {
  title: string;
  description?: string;
  emissionGroup?: LocalizedApiServiceEntry;
  emissionSources?: EmissionSource[];
  primaryScope: number;
  localizations?: EmissionCategory[];
}
