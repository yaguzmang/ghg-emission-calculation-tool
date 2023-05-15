import { configureStore } from '@reduxjs/toolkit';

import { apiSlice } from '../api/apiSlice';

const initialState = {};

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
  preloadedState: initialState,
});
