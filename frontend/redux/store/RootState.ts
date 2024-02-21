import { SharedUIState } from './ui/shared/stateType';

export type RootState = {
  ui: {
    shared: SharedUIState;
  };
};

export enum LocalStorageEntities {
  uiState = 'uiState',
}
