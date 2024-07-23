/* eslint-disable camelcase */
import { API_ROUTES, REQ_METHODS } from '@/utils/constants';

import { request } from './xhr';

const createPo = async (data: Omit<IPo, '_id' | 'role' | 'status'>) => {
  try {
    const response = await request<GeneralResponse<{ status: string }>>(
      REQ_METHODS.POST,
      API_ROUTES.PO_API,
      data,
    );
    return response.data.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};
const updatePo = async (data: { [key: string]: string }, id: string) => {
  try {
    const response = await request<GeneralResponse<IPo>>(
      REQ_METHODS.PUT,
      API_ROUTES.PO_API + `/${id}`,
      data,
    );
    return response.data.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};
const getDetailPo = async (id: string) => {
  try {
    const response = await request<GeneralResponse<IPo>>(
      REQ_METHODS.GET,
      API_ROUTES.PO_API + `/${id}`,
    );
    return response.data.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};
const deletePo = async (id: string) => {
  try {
    const response = await request<GeneralResponse<any>>(
      REQ_METHODS.POST,
      API_ROUTES.PO.SOFT_DELETE,
      { id },
    );
    return response.data.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

const banPo = async (data: { id: string; isUnban: boolean }) => {
  try {
    const response = await request<GeneralResponse<any>>(
      REQ_METHODS.POST,
      API_ROUTES.PO.BAN,
      { id: data.id, is_unban: data.isUnban },
    );
    return response.data.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

const getPo = async (data: IPoRequest) => {
  try {
    const response = await request<IPoPage>(
      REQ_METHODS.GET,
      API_ROUTES.PO_API,
      data,
    );
    return response.data;
  } catch (error) {
    console.error('doLogin error', error);
    throw error;
  }
};

export { createPo, updatePo, getPo, deletePo, banPo, getDetailPo };
