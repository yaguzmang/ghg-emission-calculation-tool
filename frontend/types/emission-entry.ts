import { CustomEmissionFactor } from './emission-factor';
import { EmissionSourceWithEmissionCategory } from './emission-source-with-category';
import { OrganizationUnit } from './organization-unit';

export type EmissionEntryWithCustomEmissionFactors = {
  id: number;
  attributes: {
    quantity: number;
    tier: number;
    quantitySource: null;
    createdAt: string;
    updatedAt: string;
    customEmissionFactorDirect: CustomEmissionFactor | null;
    customEmissionFactorIndirect: CustomEmissionFactor | null;
    customEmissionFactorBiogenic: CustomEmissionFactor | null;
  };
};

export type EmissionEntry = {
  id: number;
  attributes: {
    quantity: number;
    tier: number;
    quantitySource: null;
    createdAt: string;
    updatedAt: string;
  };
};

export type EmissionEntryWithOrganizationUnitAndEmissionSource = {
  id: number;
  attributes: {
    quantity: number;
    tier: number;
    quantitySource: string | null;
    createdAt: string;
    updatedAt: string;
    organizationUnit: {
      data: OrganizationUnit;
    };
    emissionSource: {
      data: EmissionSourceWithEmissionCategory;
    };
    customEmissionFactorDirect: CustomEmissionFactor | null;
    customEmissionFactorIndirect: CustomEmissionFactor | null;
    customEmissionFactorBiogenic: CustomEmissionFactor | null;
  };
};
