/* eslint-disable react-refresh/only-export-components */
import { ApartmentOutlined, ApiOutlined } from '@ant-design/icons';

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

const QUERY_KEYS = {
  SIGN_IN: 'SIGN_IN',
  GET_USER: 'GET_USER',
  CREATE_PO: 'CREATE_PO',
  GET_PO: 'GET_PO',
};
const ROUTES_URL = {
  HOME: '/',
  PO: '/po',
  PROJECT: '/project',
};
const MENU: MenuType = [
  {
    key: ROUTES_URL.HOME,
    label: 'Dashboard',
    path: ROUTES_URL.HOME,
    icon: <ApartmentOutlined />,
  },
  {
    key: ROUTES_URL.PO,
    label: 'PO',
    path: ROUTES_URL.PO,
    icon: <ApiOutlined />,
  },
  {
    key: ROUTES_URL.PROJECT,
    label: 'project',
    path: ROUTES_URL.PROJECT,
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
  NO_IMAGE,
  ACCESS_TOKEN_STORAGE_KEY,
  REQ_METHODS,
  QUERY_KEYS,
  MENU,
  REFRESH_TOKEN_STORAGE_KEY,
  ROUTES_URL,
};
