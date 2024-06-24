import React from 'react';
import ReactDOM from 'react-dom/client';

import '@styles/global.css';

import {
  legacyLogicalPropertiesTransformer,
  StyleProvider,
} from '@ant-design/cssinjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { App, ConfigProvider } from 'antd';
import NextTopLoader from 'nextjs-toploader';

// Import the generated route tree
import { routeTree } from './routeTree.gen';
import SolanaWalletProvider from './solana-wallets-provider';

// Create a new router instance
const router = createRouter({ routeTree });
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60,
      retry: 0,
    },
  },
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextTopLoader />
    <QueryClientProvider client={queryClient}>
      <ConfigProvider button={{ autoInsertSpace: false }} theme={{}}>
        <StyleProvider transformers={[legacyLogicalPropertiesTransformer]}>
          <App notification={{ placement: 'topRight' }}>
            <SolanaWalletProvider>
              <RouterProvider router={router} />
            </SolanaWalletProvider>
          </App>
        </StyleProvider>
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
