import * as React from 'react';
import { sleep } from '@/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { message } from 'antd';

import { doLogin, getUserInfo } from '../adapters/auth';
import { ACCESS_TOKEN_STORAGE_KEY, QUERY_KEYS } from '../utils/constants';

export interface AuthContext {
  isAuthenticated: boolean;
  login: (data: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  user: string | null;
  isLoading: boolean;
  role: 'superadmin' | 'po' | null | undefined;
}

const AuthContext = React.createContext<AuthContext | null>(null);

const key = ACCESS_TOKEN_STORAGE_KEY;

function getStoredAccessToken() {
  return localStorage.getItem(key);
}

function setStoredAccessToken(token: string | null) {
  if (token) {
    localStorage.setItem(key, token);
  } else {
    localStorage.removeItem(key);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<string | null>(getStoredAccessToken());
  const isAuthenticated = !!user;
  const { data } = useQuery({
    queryKey: [QUERY_KEYS.GET_USER],
    queryFn: getUserInfo,
    enabled: isAuthenticated,
  });
  const mutation = useMutation({
    mutationFn: doLogin,
    onSuccess: (data: IAuth) => {
      setStoredAccessToken(data.access_token);
      setUser(data.user_info.username);
      message.success('Login success');
    },
  });
  const logout = React.useCallback(async () => {
    await sleep(250);
    setStoredAccessToken(null);
    setUser(null);
  }, []);

  const login = React.useCallback(
    async (data: { username: string; password: string }) => {
      return mutation.mutate(data);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  React.useEffect(() => {
    setUser(getStoredAccessToken());
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        isLoading: mutation.isPending,
        role: data?.data.role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
