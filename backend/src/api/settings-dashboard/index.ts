import { LocalizedApiServiceEntry } from "../api.types";
import { EmissionCategory } from "../emission-category";

export interface DashboardSettings extends LocalizedApiServiceEntry {
  emissionCategories?: EmissionCategory[];
}
