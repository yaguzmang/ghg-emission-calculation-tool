export interface PolicyContext {
  state: {
    user?: {
      id: number;
    };
  };
  captures: string[];
}
