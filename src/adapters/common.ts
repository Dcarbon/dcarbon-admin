import { request } from '@adapters/xhr.ts';
import { API_ROUTES, REQ_METHODS } from '@utils/constants';

const uploadImage = async (data: IUploadImageRequest) => {
  try {
    const formData = new FormData();
    formData.append('file', data.file.originFileObj);
    formData.append('category', data.category);
    data.type && formData.append('type', data.type);
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

export { uploadImage, uploadMetadata };
