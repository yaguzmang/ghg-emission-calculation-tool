export interface PolicyContext {
  state: {
    user?: {
      id: number;
    };
  };
  captures: string[];
}

export interface ApiServiceEntry {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface LocalizedApiServiceEntry extends ApiServiceEntry {
  locale: string;
}

export interface ServiceParams {
  [key: string]: unknown;
}
