import { request } from '@adapters/xhr.ts';
import {
  IUploadImageRequest,
  IUploadImageResponse,
  IUploadMetadataRequest,
  IUploadMetadataResponse,
} from '@/types/common';
import { IMyMetadata } from '@/types/projects';
import { API_ROUTES, REQ_METHODS } from '@utils/constants';

const uploadImage = async (data: IUploadImageRequest) => {
  try {
    const formData = new FormData();
    formData.append('file', data.file.originFileObj);
    formData.append('category', data.category || '');
    data.type && formData.append('type', data.type);
    data.mode && formData.append('mode', data.mode);
    const response = await request<GeneralResponse<IUploadImageResponse>>(
      REQ_METHODS.PATCH,
      API_ROUTES.SINGER_UPLOAD,
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

const uploadMetadata = async (data: IUploadMetadataRequest) => {
  try {
    const response = await request<GeneralResponse<IUploadMetadataResponse>>(
      REQ_METHODS.POST,
      API_ROUTES.COMMON.UPLOAD_METADATA,
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

const getMetadataOfMint = async (mint: string) => {
  try {
    const response = await request<GeneralResponse<IMyMetadata>>(
      REQ_METHODS.GET,
      API_ROUTES.COMMON.GET_METADATA_OF_MINT,
      {
        mint,
      },
    );
    return response.data.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

export { uploadImage, uploadMetadata, getMetadataOfMint };
