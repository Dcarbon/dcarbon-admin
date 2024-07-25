/* eslint-disable camelcase */
import { API_ROUTES, REQ_METHODS } from '@/utils/constants';
import { IDevicePage, IDeviceRequest } from '@/types/device';
import {
  IProject,
  IProjectImageRequest,
  IProjectImageResponse,
  IProjectModel,
  IProjectPage,
  IProjectPageRequest,
  IProjectRequest,
} from '@/types/projects';

import { request } from './xhr';

const getProject = async ({
  page,
  limit,
  sort_field,
  sort_type,
  keyword,
}: IProjectPageRequest) => {
  try {
    const response = await request<IProjectPage>(
      REQ_METHODS.GET,
      API_ROUTES.PROJECT_API,
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
    console.error('error', error);
    throw error;
  }
};

const getModelProject = async () => {
  try {
    const response = await request<GeneralResponse<IProjectModel[]>>(
      REQ_METHODS.GET,
      API_ROUTES.PROJECT_MODEL,
    );
    return response.data.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};
const getIoTDevice = async ({
  page,
  limit,
  sort_field,
  sort_type,
  id,
  status,
  type,
}: IDeviceRequest) => {
  try {
    const response = await request<IDevicePage>(
      REQ_METHODS.GET,
      API_ROUTES.IOT_MODELS,
      {
        page,
        limit,
        sort_field,
        sort_type,
        id,
        status,
        type,
      },
    );
    return response.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};
const createProject = async (data: IProjectRequest) => {
  try {
    const response = await request<GeneralResponse<{ slug: string }>>(
      REQ_METHODS.POST,
      API_ROUTES.PROJECT_API,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};
const uploadProjectImage = async (data: IProjectImageRequest) => {
  try {
    const formData = new FormData();
    formData.append('thumbnail', data.thumbnail[0].originFileObj);
    data.images.map((image) => formData.append(`images`, image.originFileObj));
    formData.append('category', data.category);
    data.type && formData.append('type', data.type);
    data.id && formData.append('id', data.id);
    const response = await request<GeneralResponse<IProjectImageResponse>>(
      REQ_METHODS.PATCH,
      API_ROUTES.PROJECT_UPLOAD,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};
const getProjectBySlug = async (slug: string) => {
  try {
    const response = await request<GeneralResponse<IProject>>(
      REQ_METHODS.GET,
      API_ROUTES.PROJECT_API + '/' + slug,
    );
    return response.data.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};
const updateProject = async (data: Partial<IProjectRequest>) => {
  try {
    const response = await request<GeneralResponse<{ status: string }>>(
      REQ_METHODS.PUT,
      API_ROUTES.PROJECT_API,
      data,
    );
    return response.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};
export {
  getProject,
  getProjectBySlug,
  getModelProject,
  getIoTDevice,
  uploadProjectImage,
  createProject,
  updateProject,
};
