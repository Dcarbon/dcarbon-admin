import { EMintScheduleType, EProjectStatus, EProjectType } from '@/enums';
import { CommonType, DeviceDataType, TIotDeviceType } from '@/types/device';

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
  po_wallet: string;
  power: number;
  spec: object;
  specs: any;
  status: EProjectStatus;
  mint_schedule: EMintScheduleType;
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
  po_wallet: string;
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

  mint_time?: string;
}

interface IConfigTokenResponse {
  carbon?: SplToken;
  dcarbon?: SplToken;
  signer?: string;
}

interface IAddDevicesInput {
  project_id: string;
  device_ids: string[];
}

type ProjectDashboardTypes = {
  carbon_credit: {
    minted: {
      total: number;
      compare_last_week_ratio: number;
    };
    sold: {
      total: number;
      compare_last_week_ratio: number;
    };
  };
  aggregation: {
    crypto: number;
    cost: {
      amount: number;
      currency: string;
    };
    assets_total: number;
  };
};
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

interface IMintListing {
  address: string;
  total: number;
  delegated: number;
  available: number;
  real_available?: number;
}

export interface IMintOfProject {
  project_id: string;
  mints: IMintListing[];
}

export interface IMyMetadata {
  mint: string;
  name: string;
  symbol: string;
  uri: string;
  image?: string;
  description?: string;
  attributes?: {
    trait_type: string;
    value: string;
  }[];
}

export interface IProjectListingInfoRequest {
  slug: string;
  owner_wallet: string;
  page?: number;
  limit?: number;
}

interface IProjectListingInfo {
  key: string;

  seller: string;

  project_id: string;

  mint: string;

  available: number;

  name?: string;

  symbol?: string;
}

export interface IProjectListingInfoResponse {
  paging: {
    total: number;
    page: number;
    limit: number;
  };
  common: {
    available_carbon: number;
    payment_info: {
      currency: {
        name: string;
        symbol: string;
        mint: string;
        icon: string;
      };
      exchange_rate: number;
    };
    all_listing: IProjectListingInfo[];
  };
  data: IProjectListingInfo[];
}

export interface IProjectDocumentAddRequest {
  document_name: string;
  document_type: string;
  document_path: string;
}

export interface IProjectDocumentResponse extends IProjectDocumentAddRequest {
  document_id: string;
  created_at: string;
}
