import { combineReducers } from '@reduxjs/toolkit';

import { sharedUISliceReducer } from './ui/shared/slice';

export const rootReducer = {
  ui: combineReducers({
    shared: sharedUISliceReducer,
  }),
};
