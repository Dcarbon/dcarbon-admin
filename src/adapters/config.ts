import { request } from '@adapters/xhr.ts';
import { TIotDeviceType } from '@/types/device';
import { API_ROUTES, REQ_METHODS } from '@utils/constants';

const getConfigTokens = async () => {
  try {
    const response = await request<GeneralResponse<IConfigTokenResponse>>(
      REQ_METHODS.GET,
      API_ROUTES.CONFIG.TOKEN,
    );
    return response.data.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};
const getDeviceTypes = async () => {
  try {
    const response = await request<GeneralResponse<TIotDeviceType[]>>(
      REQ_METHODS.GET,
      API_ROUTES.DEVICE.TYPES,
    );
    return response.data.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};
export { getConfigTokens, getDeviceTypes };
