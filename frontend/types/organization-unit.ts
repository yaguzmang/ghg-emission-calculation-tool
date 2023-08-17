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
  dividerValues: DividerValue[];
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
