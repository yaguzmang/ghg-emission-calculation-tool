export type EmissionFactor = {
  value: number;
  data_source: {
    description?: string;
    url?: string;
  };
};

export type CustomEmissionFactor = {
  id: number;
  value: number;
  source: string | null;
};

export type CustomEmissionFactors = {
  customEmissionFactorDirect?: CustomEmissionFactor;
  customEmissionFactorIndirect?: CustomEmissionFactor;
  customEmissionFactorBiogenic?: CustomEmissionFactor;
};
