import { EProjectType } from '@/enums';
import { DeviceDataType, TIotDeviceType } from '@/types/device';

type TLocation = {
  latitude: number;
  longitude: number;
  iframe: string;
  name: string;
};

type TCountry = {
  code: string;
  name: string;
};

interface IProject {
  id: string;
  slug: string;
  project_name: string;
  description: string;
  country: TCountry;
  destination_wallet: string;
  images: [];
  location_name: string;
  location: TLocation;
  type: {
    id: number;
    code: string;
    name: string;
  };
  thumbnail: string;
  devices: DeviceDataType[];
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
  location_name: string;
  location: {
    latitude: number;
    longitude: number;
    iframe: string;
  };
  type: EProjectType;
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
  iot_device_type: TIotDeviceType;
};

interface IProjectPageRequest {
  page?: number;
  limit?: number;
  sort_field?: string;
  sort_type?: string;
  keyword?: string;
}

interface IProjectModel {
  id: number;
  code: EProjectType;
  name: string;
  active?: boolean;
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
  signer?: string;
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
