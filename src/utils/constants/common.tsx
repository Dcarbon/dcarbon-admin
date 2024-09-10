/* eslint-disable react-refresh/only-export-components */
import {
  DollarOutlined,
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
  COMMON: {
    GET_METADATA_OF_MINT: 'GET_METADATA_OF_MINT',
  },
  DEVICE: {
    TYPES: 'GET_DEVICE_TYPES',
    CONTRACT_SETTINGS: 'GET_DEVICE_CONTRACT_SETTINGS',
  },
  CONFIG: {
    SPL_TOKEN: 'SPL_TOKEN',
  },
  MANAGER: {
    CARBON_LIST: 'CARBON_LIST',
  },
  PROJECT: {
    CARBON_FOR_LISTING: 'CARBON_FOR_LISTING',
    LISTING_INFO: 'LISTING_INFO',
    DOCUMENT_UPLOAD_URL: 'DOCUMENT_UPLOAD_URL',
    DOCUMENTS: 'DOCUMENTS',
  },
};
const ROUTES_URL = {
  PROJECT: '/project',
  PO: '/po',
  CONTRACT: '/contract',
  WALLET: '/wallet',
};
const MENU: MenuType = [
  {
    key: ROUTES_URL.PROJECT,
    label: 'Project',
    path: ROUTES_URL.PROJECT,
    icon: <ProjectOutlined />,
  },
  {
    key: ROUTES_URL.PO,
    label: 'PO',
    path: ROUTES_URL.PO,
    icon: <UserOutlined />,
  },
  {
    key: ROUTES_URL.CONTRACT,
    label: 'Contract',
    path: ROUTES_URL.CONTRACT,
    icon: <ProfileOutlined />,
  },
  {
    key: ROUTES_URL.WALLET,
    label: 'Wallet',
    path: ROUTES_URL.WALLET,
    icon: <DollarOutlined />,
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
