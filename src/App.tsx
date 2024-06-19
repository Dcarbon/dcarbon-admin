import '@/styles/App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import 'antd/dist/reset.css';
import { ConfigProvider, theme } from 'antd';
import { AxiosError } from 'axios';
import React from 'react';
import Swal from 'sweetalert2';
import AppRoutes from './route';
import { getSweetErrorConfig } from './utils/helpers';

function App() {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60,
            retry: 0,
            throwOnError(error) {
              const descMsg =
                error instanceof AxiosError
                  ? error?.response?.data?.message
                  : 'Some thing went wrong!';
              Swal.fire(getSweetErrorConfig(descMsg));

              return false;
            },
          },
        },
      })
  );
  return (
    <ConfigProvider
      virtual
      componentSize="large"
      theme={{
        algorithm: theme.compactAlgorithm,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
}

export default App;
