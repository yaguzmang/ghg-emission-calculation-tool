import { LocalizedApiServiceEntry } from "../api.types";
import { EmissionCategory } from "../emission-category";

export interface EmissionSource {
  id: number;
  apiId: string;
  emissionSourceGroup: LocalizedApiServiceEntry;
  name: string;
  emissionCategory: EmissionCategory;
}
