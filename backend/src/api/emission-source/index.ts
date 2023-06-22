import { ApiServiceEntry } from "../api.types";
import { EmissionCategory } from "../emission-category";
import { EmissionSourceGroup } from "../emission-source-group";

export interface EmissionSource extends ApiServiceEntry {
  id: number;
  apiId: string;
  emissionSourceGroup?: EmissionSourceGroup;
  name: string;
  emissionCategory?: EmissionCategory;
}
