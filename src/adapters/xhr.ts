import { ACCESS_TOKEN_STORAGE_KEY, REQ_METHODS } from '@/utils/constants';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const DEFAULT_TIMEOUT = 20000;
const BASE_URL = import.meta.env.VITE_API_ENDPOINT;

const axiosInstance = axios.create({
  timeout: DEFAULT_TIMEOUT,
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (defaultConfig) => {
    const token =
      typeof window !== 'undefined' &&
      localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    if (token && !defaultConfig.headers.getAuthorization()) {
      defaultConfig.headers.setAuthorization(`Bearer ${token}`);
    }
    if (!defaultConfig.headers.getContentType()) {
      defaultConfig.headers.setContentType('application/json');
    }
    return defaultConfig;
  },
  (error) => {
    delete axios.defaults.headers.common['Authorization'];
    Promise.reject(error);
  },
);
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response.status === 401 &&
      localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
    ) {
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
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

  const commonOptions: AxiosRequestConfig = {
    ...options,
    signal: controller.signal,
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
