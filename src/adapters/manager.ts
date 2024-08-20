import { request } from '@adapters/xhr.ts';
import { IListCarbonManagerPage } from '@/types/manager';
import { API_ROUTES, REQ_METHODS } from '@utils/constants';

const getManagersCarbonList = async (query: {
  wallet: string;
  page: number;
  limit: number;
}) => {
  try {
    const response = await request<IListCarbonManagerPage>(
      REQ_METHODS.GET,
      API_ROUTES.MANAGER.CARBON_LIST,
      query,
    );
    return response.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

export { getManagersCarbonList };
