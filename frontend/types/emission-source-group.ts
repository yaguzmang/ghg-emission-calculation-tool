import { EmissionSourceFlattenWithFactors } from './emission-source';

export type EmissionSourceGroup = {
  id: number;
  attributes: {
    name: string;
    emissionSourceLabel: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
  };
};

export type EmissionSourceGroupFlattenWithSources = {
  id: number;
  createdAt: string;
  updatedAt: string;
  locale: string;
  name: string;
  emissionSourceLabel: string;
  emissionSources: EmissionSourceFlattenWithFactors[];
};
