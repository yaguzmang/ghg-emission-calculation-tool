import { EmissionFactor } from './emission-factor';

export type EmissionSource = {
  id: number;
  attributes: {
    apiId: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type EmissionSourceFlatten = {
  id: number;
  apiId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type EmissionSourceFlattenWithFactors = {
  id: number;
  apiId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  factors: {
    biogenic: EmissionFactor;
    indirect: EmissionFactor;
    direct: EmissionFactor;
  };
  label: string;
  unit: string;
};
