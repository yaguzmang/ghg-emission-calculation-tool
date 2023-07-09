import { EmissionData } from './emission';
import { EmissionSourceFlatten } from './emission-source';
import { EmissionSourceGroupFlattenWithSources } from './emission-source-group';

export type EmissionCategory = {
  id: number;
  attributes: {
    title: string;
    description: string;
    primaryScope: number;
    emissionSourceLabel: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
  };
};

export type EmissionCategoryFlattenWithEmissions = {
  id: number;
  title: string;
  description: string | null;
  primaryScope: number;
  emissionSourceLabel: string | null;
  createdAt: string;
  updatedAt: string;
  locale: string;
  emissionSources: EmissionSourceFlatten[];
  emissions: EmissionData;
};

export type EmissionCategoryFlattenWithSourceGroups = {
  id: number;
  title: string;
  description: string | null;
  primaryScope: number;
  emissionSourceLabel: string | null;
  createdAt: string;
  updatedAt: string;
  locale: string;
  emissionSourceGroups: EmissionSourceGroupFlattenWithSources[];
};
