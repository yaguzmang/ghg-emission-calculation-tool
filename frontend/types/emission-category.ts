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
