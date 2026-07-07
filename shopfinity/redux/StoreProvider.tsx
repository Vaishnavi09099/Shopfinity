'use client';
import { SessionProvider } from 'next-auth/react';
import React from 'react'
import { store } from './store';
import { Provider } from 'react-redux';

const storeProvider = ({children}:Readonly<{children:React.ReactNode}>) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}

export default storeProvider