import * as React from 'react';
import { doLogin } from '@/adapters/auth';
import { SUCCESS_MSG } from '@/constants';
import {
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
} from '@/utils/constants';
import useModalAction from '@/utils/helpers/back-action.tsx';
import { useMutation } from '@tanstack/react-query';
import { Modal } from 'antd';
import jwt from 'jsonwebtoken';
import { IAuth, IUser } from '@/types/auth';
import useNotification from '@utils/helpers/my-notification.tsx';

export interface AuthContext {
  isAuthenticated: boolean;
  login: (data: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  user?: IUser;
  isLoading: boolean;
}

const AuthContext = React.createContext<AuthContext>({
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  user: undefined,
  isLoading: false,
});

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

function userInfo() {
  let user: IUser | undefined;
  const token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  if (token) {
    user = jwt.decode(token) as IUser;
  }
  return user;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<IUser | undefined>(userInfo());
  const [myNotification] = useNotification();
  const isAuthenticated = !!user;
  const logoutConfirm = useModalAction({
    title: 'Do you want to logout?',
    fn: () => {
      Modal.destroyAll();
      setUser(undefined);
      setStoredAccessToken(null);
      setStoredRefreshToken(null);
    },
    option: {
      centered: true,
      maskClosable: true,
      destroyOnClose: true,
    },
  });
  const mutation = useMutation({
    mutationFn: doLogin,
    onSuccess: (data: IAuth) => {
      setUser(data.user_info);
      setStoredAccessToken(data.access_token);
      setStoredRefreshToken(data.refresh_token);
      myNotification({
        type: 'success',
        description: SUCCESS_MSG.AUTH.SIGN_IN_SUCCESS,
      });
    },
    onError: (error: any) => {
      myNotification({
        message: 'Sing In Failed',
        description: error.message || 'Something went wrong',
      });
    },
  });
  const logout = React.useCallback(async () => {
    if (isAuthenticated) {
      logoutConfirm();
    }
  }, [isAuthenticated]);

  const login = React.useCallback(
    async (data: { username: string; password: string }) => {
      return mutation.mutate(data);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  React.useEffect(() => {
    const user = userInfo();
    if (user) setUser(user);
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
