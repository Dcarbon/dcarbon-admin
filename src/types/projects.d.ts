interface IProject {
  id: string;
  slug: string;
  project_name: string;
  description: string;
  country: string;
  destination_wallet: string;
  images: [];
  location: string;
  iot_models: [
    {
      id: string;
      model_name: string;
    },
  ];
  thumbnail: string;
  devices: {
    id?: string;
    iot_device_id: string;
    device_name?: string;
    device_type: string;
    status: 'active' | 'de_active';
  }[];
  manager: Pick<IPo, 'profile_name' | 'user_name' | 'id'>;
  power: number;
  spec: object;
  status: 'draft' | 'active' | 'deactivate';
}

interface IProjectRequest {
  id: string;
  project_name: string;
  description: string;
  country: string;
  destination_wallet: string;
  images: [];
  location: string;
  iot_models: string[] | string;
  thumbnail: string;
  devices: {
    iot_device_id: string;
    iot_device_type: string;
  }[];
  po_id: string;
  power: number;
  spec: object;
  status: 'draft' | 'active' | 'deactivate';
}

interface IProjectPage {
  data: IProject[];
  paging: {
    total: number;
    page: number;
    limit: number;
  };
}

type DeviceType = {
  iot_device_id: string;
  iot_device_type: string;
};

interface IProjectPageRequest {
  page?: number;
  limit?: number;
  sort_field?: string;
  sort_type?: string;
  keyword?: string;
}

interface IProjectModel {
  id: string;
  model_name: string;
  created_at: string;
  updated_at: string;
}

interface IProjectImageRequest {
  id?: string;
  type?: string;
  category: string;
  thumbnail: any[];
  images: any[];
}

interface IProjectImageResponse {
  id: string;
  result: {
    field: string;
    result: {
      path: string;
      relative_path: string;
    }[];
  }[];
}

class SplToken {
  mint: string;

  name: string;

  symbol: string;

  decimals: number;

  supply: number;

  description?: string;

  image: string;

  freeze_authority?: string;

  mint_authority?: string;
}

interface IConfigTokenResponse {
  carbon?: SplToken;
  dcarbon?: SplToken;
}

type ProjectList = Omit<
  IProject,
  | 'images'
  | 'iot_models'
  | 'devices'
  | 'power'
  | 'spec'
  | 'description'
  | 'manager_id',
  'destination_wallet'
>;
