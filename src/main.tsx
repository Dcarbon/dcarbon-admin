import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

import '@styles/global.css';

import { AuthProvider, useAuth } from '@/contexts/auth-context';
import SolanaWalletProvider from '@/contexts/solana-wallets-provider';
import { routeTree } from '@/routeTree.gen';
import {
  legacyLogicalPropertiesTransformer,
  StyleProvider,
} from '@ant-design/cssinjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { App, ConfigProvider, Spin, theme } from 'antd';
import NextTopLoader from 'nextjs-toploader';
import NotFoundPage from '@components/common/not-found';

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
export const RouterClient = () => {
  const auth = useAuth();
  return (
    <Suspense fallback={<Spin fullscreen spinning size="large" />}>
      <RouterProvider router={router} context={auth} />
    </Suspense>
  );
};
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
            borderRadius: 4,
            colorBorder: '#F6F6F6',
            lineHeight: 1.5,
          },
          components: {
            Layout: {
              siderBg: '#fff',
              headerBg: '#fff',
              triggerBg: '#5daf01',
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
