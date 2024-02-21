import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { configureStore } from '@reduxjs/toolkit';

import { apiSlice } from '../api/apiSlice';
import { rootReducer } from './rootReducer';
import { LocalStorageEntities, RootState } from './RootState';

import i18n from '@/i18n/i18n';

let initialState = {} as RootState | undefined;
if (typeof window !== 'undefined') {
  const storedData = localStorage?.getItem(LocalStorageEntities.uiState);
  try {
    initialState = storedData ? JSON.parse(storedData) : undefined;
  } catch (_e) {
    initialState = undefined;
  }
}

if (initialState?.ui?.shared?.selectedLocale !== undefined) {
  i18n.changeLanguage(initialState.ui.shared.selectedLocale);
} else {
  i18n.changeLanguage('et');
}
export const store = configureStore({
  reducer: {
    ...rootReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
  preloadedState: initialState,
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
