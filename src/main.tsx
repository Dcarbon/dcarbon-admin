import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';

import '@styles/global.css';

import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { ContractRoleProvider } from '@/contexts/contract-role-context.tsx';
import SolanaWalletProvider from '@/contexts/solana-wallets-provider';
import { routeTree } from '@/routeTree.gen';
import {
  legacyLogicalPropertiesTransformer,
  StyleProvider,
} from '@ant-design/cssinjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, Router, RouterProvider } from '@tanstack/react-router';
import { App, ConfigProvider, Spin, theme } from 'antd';
import NextTopLoader from 'nextjs-toploader';
import NotFoundPage from '@components/common/not-found';

import Error from './components/common/error';

// Create a new router instance
const router: Router<any, any> = createRouter({
  routeTree,
  context: {
    auth: undefined!,
    queryClient: undefined!,
  },
  defaultErrorComponent: () => Error,
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
      <RouterProvider router={router} context={{ auth, queryClient }} />
    </Suspense>
  );
};
const AppProvider = () => {
  return (
    <AuthProvider>
      <ContractRoleProvider>
        <RouterClient />
      </ContractRoleProvider>
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
            fontFamily: 'Lexend',
            fontFamilyCode: 'Lexend',
            colorPrimaryBgHover: '#5daf01',
            colorBgTextHover: '#F6F6F6',
            fontSize: 20,
            borderRadius: 4,
            colorBorder: '#F6F6F6',
            lineHeight: 1.5,
            fontSizeLG: 14,
          },
          components: {
            Layout: {
              siderBg: '#fff',
              headerBg: '#fff',
              triggerBg: '#5daf01',
            },
            Form: {
              labelFontSize: 14,
              colorTextPlaceholder: '#888888',
              labelColor: '#21272A',
            },
            Table: {
              rowSelectedHoverBg: '#d5ff96',
            },
            Menu: {
              colorPrimary: '#1B1B1B',
              itemSelectedBg: '#F6F6F6',
              colorText: '#888888',
            },
            Checkbox: {
              colorBorder: '#c1c1c1',
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
