export type EmissionTotal = {
  emissions: number;
  accuracy: number;
};

export type EmissionResults = {
  totalEmissions: {
    scope1: EmissionTotal;
    scope2: EmissionTotal;
    scope3: EmissionTotal;
    biogenic: EmissionTotal;
  };
  organizationUnits: EmissionResultsByOrganizationUnit[];
};

export type EmissionsTotalByCategory = {
  id: number;
  title: string;
  primaryScope: number;
  color: string;
} & EmissionTotal;

export type EmissionResultsByOrganizationUnit = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  emissions: {
    scope1: EmissionsTotalByCategory[];
    scope2: EmissionsTotalByCategory[];
    scope3: EmissionsTotalByCategory[];
    biogenic: EmissionsTotalByCategory[];
  };
};

export type EmissionCategoryTotalByEmissionType = Omit<
  EmissionsTotalByCategory,
  'emissions' | 'accuracy'
> & {
  emissionType: 'scope1' | 'scope2' | 'scope3' | 'biogenic';
  totalEmissions: number;
};
