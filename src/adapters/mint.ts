import { request } from '@adapters/xhr.ts';
import { API_ROUTES, REQ_METHODS } from '@utils/constants';

const mintSNFT = async (data: IMintInput) => {
  try {
    const response = await request<GeneralResponse<{ status: string }>>(
      REQ_METHODS.POST,
      import.meta.env.VITE_MINTING_ENDPOINT + API_ROUTES.MINT.ROOT,
      data,
      undefined,
      true,
    );
    return response.data.data;
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};
export { mintSNFT };
