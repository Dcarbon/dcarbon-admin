import { request } from '@adapters/xhr.ts';
import {
  IDeviceContractSettings,
  ISqlToken,
  TIotDeviceType,
} from '@/types/device';
import { IConfigTokenResponse } from '@/types/projects';
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
const getDeviceContractSettings = async () => {
  try {
    const response = await request<GeneralResponse<IDeviceContractSettings>>(
      REQ_METHODS.GET,
      API_ROUTES.DEVICE.CONTRACT_SETTINGS,
    );
    return response.data.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};
const getSplToken = async () => {
  try {
    const response = await request<GeneralResponse<ISqlToken[]>>(
      REQ_METHODS.GET,
      API_ROUTES.CONFIG.SPL_TOKEN,
    );
    return response.data.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};
export {
  getConfigTokens,
  getDeviceTypes,
  getDeviceContractSettings,
  getSplToken,
};
