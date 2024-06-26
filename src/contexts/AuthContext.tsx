import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';

import { doLogin } from '../adapters/auth';
import {
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
} from '../utils/constants';

export interface AuthContext {
  isAuthenticated: boolean;
  login: (data: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  user: string | null;
  isLoading: boolean;
}

const AuthContext = React.createContext<AuthContext>({
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  user: null,
  isLoading: false,
});

function getStoredAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

function setStoredRefreshToken(token: string | null) {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  }
}

function setStoredAccessToken(token: string | null) {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<string | null>(getStoredAccessToken());
  const isAuthenticated = !!user;
  const mutation = useMutation({
    mutationFn: doLogin,
    onSuccess: (data: IAuth) => {
      Promise.all([
        setStoredAccessToken(data.access_token),
        setStoredRefreshToken(data.refresh_token),
        setUser(data.user_info.username),
      ]);
      message.success('Login success');
    },
  });
  const logout = React.useCallback(async () => {
    Promise.all([
      setStoredAccessToken(null),
      setStoredRefreshToken(null),
      setUser(null),
    ]).then(() => {});
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
      }}
    >
      {/* <ChangePassword /> */}
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

export { AuthContext };
