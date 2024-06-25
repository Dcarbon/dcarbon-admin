import React from 'react';
import ReactDOM from 'react-dom/client';

import '@styles/global.css';

import AppRoute from '@/routes/index';
import {
  legacyLogicalPropertiesTransformer,
  StyleProvider,
} from '@ant-design/cssinjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { App, ConfigProvider, notification, theme } from 'antd';
import { AxiosError } from 'axios';
import NextTopLoader from 'nextjs-toploader';

import { AuthProvider } from './contexts/AuthContext';
import SolanaWalletProvider from './solana-wallets-provider';

// eslint-disable-next-line react-refresh/only-export-components
function AppProvider() {
  return (
    <AuthProvider>
      <AppRoute />
    </AuthProvider>
  );
}
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60,
      retry: 5,
      retryDelay: 1000,
      throwOnError(error) {
        const descMsg =
          error instanceof AxiosError
            ? error?.response?.data?.message
            : 'Some thing went wrong!';
        notification.error({ message: descMsg });
        return false;
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextTopLoader />
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        virtual
        button={{ autoInsertSpace: false }}
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
      <div style={{ position: 'fixed', bottom: 0, zIndex: 99 }}>
        <ReactQueryDevtools position="bottom" initialIsOpen={false} />
      </div>
    </QueryClientProvider>
  </React.StrictMode>,
);
