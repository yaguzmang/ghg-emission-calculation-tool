'use client';

import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';

import { SessionProvider } from 'next-auth/react';

import { store } from '@/redux/store/store';

interface Props {
  children: ReactNode;
}
function ProviderWrapper({ children }: Props) {
  return (
    <SessionProvider>
      <Provider store={store}>{children}</Provider>
    </SessionProvider>
  );
}

export default ProviderWrapper;
