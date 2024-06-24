import { ACCESS_TOKEN_STORAGE_KEY, AUTH_METHOD } from '@/utils/constants/jwt';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { THROW_EXCEPTION } from './exceptions';

const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
};

const DEFAULT_TIMEOUT = 20000;
const BASE_URL = import.meta.env.VITE_API_ENDPOINT;

const axiosInstance = axios.create({
  timeout: DEFAULT_TIMEOUT,
  baseURL: BASE_URL,
});

const request = async (
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  data?: any,
  options?: AxiosRequestConfig,
): Promise<AxiosResponse | null | { message: string }> => {
  const controller = new AbortController();

  if (import.meta.env.NEXT_PUBLIC_AUTH_METHOD === AUTH_METHOD.HEADER) {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    if (accessToken) {
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
    case 'DELETE':
    case 'GET':
      commonOptions.params = data;
      break;
    case 'POST':
    case 'PATCH':
    case 'PUT':
      commonOptions.data = JSON.stringify(data);
      break;
  }

  try {
    const result = await axiosInstance(BASE_URL + url, commonOptions);
    return result;
  } catch {
    return { message: THROW_EXCEPTION.UNKNOWN };
  } finally {
    //
  }
};

export { request };
