import {
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
} from '@/utils/constants';
import { AUTH_METHOD } from '@/utils/constants/jwt';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { THROW_EXCEPTION } from './exceptions';

const DEFAULT_TIMEOUT = 20000;
const BASE_URL = import.meta.env.VITE_API_ENDPOINT;

const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
};

const axiosInstance = axios.create({
  timeout: DEFAULT_TIMEOUT,
  baseURL: BASE_URL,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response.status === 401 &&
      localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
    ) {
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
      delete axios.defaults.headers.common['Authorization'];
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
const request = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  data?: any,
  options?: AxiosRequestConfig,
  isOverWriteUrl?: boolean,
  isPublic?: boolean,
): Promise<AxiosResponse<T>> => {
  const controller = new AbortController();

  if (import.meta.env.VITE_AUTH_METHOD === AUTH_METHOD.HEADER) {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    if (accessToken) {
      defaultHeaders.Authorization = `Bearer ${accessToken}`;
    }
  }
  if (isPublic) {
    delete defaultHeaders.Authorization;
  }
  const commonOptions: AxiosRequestConfig = {
    ...options,
    signal: controller.signal,
    headers: { ...defaultHeaders, ...options?.headers },
    method,
    withCredentials: true,
  };
  switch (method) {
    case 'DELETE':
    case 'GET':
      commonOptions.params = data;
      break;
    case 'POST':
    case 'PATCH':
    case 'PUT':
      commonOptions.data = data;
      break;
  }

  try {
    const result = await axiosInstance(
      isOverWriteUrl ? url : BASE_URL + url,
      commonOptions,
    );
    return result;
  } catch (error: any) {
    throw error.response?.data || THROW_EXCEPTION;
  } finally {
    //
  }
};

export { request };
