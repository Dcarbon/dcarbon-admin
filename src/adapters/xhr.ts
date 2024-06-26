import {
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
  REQ_METHODS,
} from '@/utils/constants';
import { AUTH_METHOD } from '@/utils/constants/jwt';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

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
const request = <T>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  data?: any,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  const controller = new AbortController();

  if (import.meta.env.VITE_AUTH_METHOD === AUTH_METHOD.HEADER) {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    if (accessToken) {
      console.info('accessToken', accessToken);
      defaultHeaders.Authorization = `Bearer ${accessToken}`;
    }
  }

  const commonOptions: AxiosRequestConfig = {
    ...options,
    signal: controller.signal,
    headers: Object.assign(defaultHeaders, options?.headers),
    method,
    withCredentials: true,
  };
  switch (method) {
    case REQ_METHODS.POST:
      return axiosInstance.post(url, data, commonOptions);
    case REQ_METHODS.PATCH:
      return axiosInstance.patch(url, data, commonOptions);
    case REQ_METHODS.PUT:
      return axiosInstance.put(url, data, commonOptions);
    case REQ_METHODS.DELETE:
      return axiosInstance.delete(url, commonOptions);
    default:
      return axiosInstance.get(url, {
        params: data,
        ...commonOptions,
      });
  }
};

export { request };
