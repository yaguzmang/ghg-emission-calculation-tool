import { LocalizedApiServiceEntry } from "../api.types";
import { EmissionFactorDataset } from "../emission-factor-dataset";

export interface EmissionFactorDatum extends LocalizedApiServiceEntry {
  json: unknown;
  dataset?: EmissionFactorDataset;
  year: string;
}
