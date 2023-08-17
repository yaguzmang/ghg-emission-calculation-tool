export type OrganizationDivider = {
  id: number;
  attributes: {
    label: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type DividerValue = {
  id: number;
  value: number;
  organizationDivider: {
    data: OrganizationDivider | null;
  };
};
