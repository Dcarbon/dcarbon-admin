import { Country } from 'country-list';

interface IUploadImageRequest {
  id?: string;
  type?: TUploadType;
  category?: TUploadCategory;
  file: any;
  mode?: 'default' | 'ipfs';
}

interface IUploadMetadataRequest {
  name: string;

  symbol: string;

  description: string;

  image: string;
}

interface IUploadImageResponse {
  id: string;
  result: {
    field: string;
    result: {
      path: string;
      relative_path: string;
    }[];
  }[];
}

interface IUploadMetadataResponse {
  metadata: IUploadMetadataRequest;
  metadata_path: string;
}

interface IMyCountry extends Country {
  id: string;
}

interface ICoefficient {
  key: string;
  value: any;
  isOnChain?: boolean;
}
