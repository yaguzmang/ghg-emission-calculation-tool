import { Organization } from "./organization";

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

export type AuthorizedService = {
  isAllowedForUser: (entryId: number, userId: number) => Promise<boolean>;
};

export interface User extends ApiServiceEntry {
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  locale?: string;
  organizations?: Organization[];
}
