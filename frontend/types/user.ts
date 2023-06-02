import { Organization } from './organization';

export type User = {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  locale: string;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  organizations: Organization[];
};
