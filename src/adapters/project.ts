/* eslint-disable camelcase */
import { API_ROUTES, REQ_METHODS } from '@/utils/constants';
import { IDevicePage, IDeviceRequest } from '@/types/device';
import {
  IAddDevicesInput,
  IMintOfProject,
  IProject,
  IProjectImageRequest,
  IProjectImageResponse,
  IProjectModel,
  IProjectPage,
  IProjectPageRequest,
  IProjectRequest,
  ProjectDashboardTypes,
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
  project_id,
}: IDeviceRequest) => {
  try {
    const response = await request<IDevicePage>(
      REQ_METHODS.GET,
      API_ROUTES.DEVICE.ROOT,
      {
        page,
        limit,
        sort_field,
        sort_type,
        id,
        status,
        type,
        project_id,
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
const uploadMultipleProjectImage = async (data: {
  image: any[];
  type: 'thumbnail' | 'list';
}) => {
  try {
    const formData = new FormData();

    data.image.map((image) => formData.append('files', image.originFileObj));
    formData.append('category', 'project');
    data.type && formData.append('type', data.type);
    const response = await request<GeneralResponse<IProjectImageResponse>>(
      REQ_METHODS.PATCH,
      API_ROUTES.MUTIPLER_UPLOAD,
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
      API_ROUTES.PROJECT_API + `/${data.id}`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};
const addDevices = async (data: Partial<IAddDevicesInput>) => {
  try {
    const response = await request<GeneralResponse<{ status: string }>>(
      REQ_METHODS.PUT,
      API_ROUTES.PROJECT.ADD_DEVICES,
      data,
    );
    return response.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};
const getDashBoardProject = async (slug: string) => {
  try {
    const response = await request<GeneralResponse<ProjectDashboardTypes>>(
      REQ_METHODS.GET,
      API_ROUTES.PROJECT_API + `/${slug}/dashboard`,
    );
    return response.data.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};
const carbonForListing = async (slug: string, ownerWallet?: string) => {
  if (!ownerWallet) return;
  try {
    const response = await request<GeneralResponse<IMintOfProject>>(
      REQ_METHODS.GET,
      API_ROUTES.PROJECT_API +
        `/${slug}/${API_ROUTES.PROJECT.CARBON_FOR_LISTING}`,
      {
        owner_wallet: ownerWallet,
      },
    );
    return response.data.data;
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
  addDevices,
  uploadMultipleProjectImage,
  getDashBoardProject,
  carbonForListing,
};
