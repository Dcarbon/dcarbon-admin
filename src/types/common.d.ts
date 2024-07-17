interface IUploadImageRequest {
  id?: string;
  type?: TUploadType;
  category: TUploadCategory;
  file: any;
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
