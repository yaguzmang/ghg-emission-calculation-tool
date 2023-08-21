import { EmissionCategoryTotalByEmissionType } from './emission-result';
import { DividerValue } from './organization-divider';

export type OrganizationUnit = {
  id: number;
  attributes: {
    name: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type OrganizationData = {
  id: number;
  attributes: {
    name: string;
    createdAt: string;
    updatedAt: string;
    organizationUnits: {
      data: OrganizationUnit[];
    };
  };
};

export type OrganizationUnitWithDividerValues = OrganizationUnit & {
  attributes: { dividerValues: DividerValue[] };
};

export type OrganizationUnitsWithDividerValues = {
  id: number;
  attributes: {
    name: string;
    createdAt: string;
    updatedAt: string;
    organizationUnits: {
      data: OrganizationUnitWithDividerValues[];
    };
  };
};

export type OrganizationUnitWithTotalGHGEmissions = {
  id: number;
  name: string;
  totalGHGEmissions: number;
};

export type NormalizedOrganizationUnitWithTotalGHGEmissions = {
  id: number;
  name: string;
  totalGHGEmissions: number;
  totalGHGEmissionsNormalized: number;
};

export type OrganizationUnitWithTotalGHGEmissionsAndDivider =
  OrganizationUnitWithTotalGHGEmissions & {
    organizationDivider: {
      id: number;
      label: string;
      value: number;
    };
  };

export type NormalizedOrganizationUnitWithTotalGHGEmissionsAndDivider =
  OrganizationUnitWithTotalGHGEmissionsAndDivider & {
    totalGHGEmissionsNormalized: number;
    organizationDivider: {
      totalGHGEmissionsPerDivider: number;
      totalGHGEmissionsPerDividerNormalized: number;
    };
  };

export type OrganizationUnitTotalGHGEmissionsPerCategory = {
  id: number;
  name: string;
  emissionsPerCategory: EmissionCategoryTotalByEmissionType[];
};
