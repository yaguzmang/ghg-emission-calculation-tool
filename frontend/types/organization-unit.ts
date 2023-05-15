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
