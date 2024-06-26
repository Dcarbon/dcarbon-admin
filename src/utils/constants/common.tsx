/* eslint-disable react-refresh/only-export-components */
import {
  ApartmentOutlined,
  ApiOutlined,
  DeploymentUnitOutlined,
} from '@ant-design/icons';

type MenuType = {
  key: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  children?: {
    label: string;
    path: string;
  }[];
}[];
const API_ROUTES = {
  SIGN_IN: '/auth/sign-in',
  GET_USER: '/auth/user-info',
  CREATE_PO: '/po/create-account',
};

const QUERY_KEYS = {
  SIGN_IN: 'SIGN_IN',
  GET_USER: 'GET_USER',
  CREATE_PO: 'CREATE_PO',
};

const MENU: MenuType = [
  {
    key: '1',
    label: 'Dashboard',
    path: '/dashboard',
    icon: <ApartmentOutlined />,
  },
  {
    key: '2',
    label: 'Users',
    path: '/users',
    icon: <DeploymentUnitOutlined />,
  },
  {
    key: '3',
    label: 'projects',
    path: '/project',
    icon: <ApiOutlined />,
  },
];
const REQ_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;
const NO_IMAGE = '/common/no-avatar.png';
const ACCESS_TOKEN_STORAGE_KEY = 'accessToken';
const REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';

export {
  API_ROUTES,
  NO_IMAGE,
  ACCESS_TOKEN_STORAGE_KEY,
  REQ_METHODS,
  QUERY_KEYS,
  MENU,
  REFRESH_TOKEN_STORAGE_KEY,
};
