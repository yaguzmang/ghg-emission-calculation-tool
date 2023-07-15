import { EmissionCategory } from './emission-category';
import { EmissionSource } from './emission-source';

export type EmissionSourceWithEmissionCategory = EmissionSource & {
  attributes: {
    emissionCategory: {
      data: EmissionCategory;
    };
  };
};
