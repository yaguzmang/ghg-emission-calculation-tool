import { LocalizedApiServiceEntry } from "../api.types";

export interface EmissionSourceGroup extends LocalizedApiServiceEntry {
  name: string;
  emissionSourceLabel: string;
  quantityLabel?: string;
  localizations?: EmissionSourceGroup[];
}
