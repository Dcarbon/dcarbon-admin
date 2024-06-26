import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

import '@styles/global.css';

import {
  legacyLogicalPropertiesTransformer,
  StyleProvider,
} from '@ant-design/cssinjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { App, ConfigProvider, Spin, theme } from 'antd';
import NextTopLoader from 'nextjs-toploader';

import NotFoundPage from './components/common/NotFoundPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SolanaWalletProvider from './contexts/solana-wallets-provider';
import { routeTree } from './routeTree.gen';

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
  defaultNotFoundComponent: NotFoundPage,
});
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
// eslint-disable-next-line react-refresh/only-export-components
const RouterClient = () => {
  const auth = useAuth();
  return (
    <Suspense fallback={<Spin fullscreen spinning size="large" />}>
      <RouterProvider router={router} context={auth} />;
    </Suspense>
  );
};
// eslint-disable-next-line react-refresh/only-export-components
const AppProvider = () => {
  return (
    <AuthProvider>
      <RouterClient />
    </AuthProvider>
  );
};
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextTopLoader />
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        virtual
        button={{ autoInsertSpace: false }}
        componentSize="large"
        theme={{
          algorithm: theme.compactAlgorithm,
          token: {
            colorPrimary: '#7bda08',
            colorPrimaryBgHover: '#5daf01',
            colorBgTextHover: '#B8FD59',
            fontSize: 16,
          },
          components: {
            Layout: {
              triggerBg: '#478407',
            },
          },
        }}
      >
        <StyleProvider transformers={[legacyLogicalPropertiesTransformer]}>
          <App notification={{ placement: 'topRight' }}>
            <SolanaWalletProvider>
              <AppProvider />
            </SolanaWalletProvider>
          </App>
        </StyleProvider>
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
