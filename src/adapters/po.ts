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
const updatePo = async (data: Partial<IPo>) => {
  try {
    const response = await request<GeneralResponse<IPo>>(
      REQ_METHODS.PUT,
      API_ROUTES.PO_API,
      data,
    );
    return response.data.data;
  } catch (error) {
    console.error('doLogin error', error);
    throw error;
  }
};

const getPo = async ({
  page,
  limit,
  sort_field,
  sort_type,
  keyword,
}: IPoRequest) => {
  try {
    const response = await request<IPoPage>(
      REQ_METHODS.GET,
      API_ROUTES.PO_API,
      {
        page,
        limit,
        sort_field,
        sort_type,
        keyword,
      },
    );
    return response.data;
  } catch (error) {
    console.error('doLogin error', error);
    throw error;
  }
};
export { createPo, updatePo, getPo };
