/* eslint-disable react-refresh/only-export-components */
import {
  ProfileOutlined,
  ProjectOutlined,
  UserOutlined,
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

const QUERY_KEYS = {
  SIGN_IN: 'SIGN_IN',
  GET_USER: 'GET_USER',
  CREATE_PO: 'CREATE_PO',
  GET_PO: 'GET_PO',
  GET_PROJECT: 'GET_PROJECT',
  GET_PROJECT_BY_SLUG: 'GET_PROJECT_BY_SLUG',
  GET_PROJECT_MODEL: 'GET_PROJECT_MODEL',
  GET_IOT_MODELS: 'GET_IOT_MODELS',
  GET_PROJECT_DASHBOARD: 'GET_PROJECT_DASHBOARD',
  DEVICE: {
    TYPES: 'GET_DEVICE_TYPES',
    CONTRACT_SETTINGS: 'GET_DEVICE_CONTRACT_SETTINGS',
  },
};
const ROUTES_URL = {
  PO: '/po',
  PROJECT: '/project',
  CONTRACT: '/contract',
};
const MENU: MenuType = [
  {
    key: ROUTES_URL.PO,
    label: 'PO',
    path: ROUTES_URL.PO,
    icon: <UserOutlined />,
  },
  {
    key: ROUTES_URL.PROJECT,
    label: 'Project',
    path: ROUTES_URL.PROJECT,
    icon: <ProjectOutlined />,
  },
  {
    key: ROUTES_URL.CONTRACT,
    label: 'Contract',
    path: ROUTES_URL.CONTRACT,
    icon: <ProfileOutlined />,
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
