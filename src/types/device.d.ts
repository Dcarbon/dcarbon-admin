import { EIotDeviceStatus, EIotDeviceType } from '@/enums';

type TDeviceStatus = 'active' | 'de_active' | 'used';
type CommonType = {
  iot_device_types: TIotDeviceType[];
  iot_device_status: TIotDeviceStatus[];
};

type TIotDeviceType = {
  id: EIotDeviceType;
  name: string;
  limit?: number;
};

type TIotDeviceStatus = {
  id: EIotDeviceStatus;
  code: string;
  name: string;
};

type DeviceDataType = {
  iot_device_id: string;
  project_id?: string;
  device_name: string;
  device_type: TIotDeviceType;
  status: TIotDeviceStatus;
  in_use?: boolean;
};

interface IDeviceRequest {
  page?: number;
  limit?: number;
  sort_field?: string;
  sort_type?: 'asc' | 'desc';
  id?: string;
  type?: string;
  status?: string;
  project_id?: string;
}

interface IDevicePage {
  data: DeviceDataType[];
  paging: {
    total: number;
    page: number;
    limit: number;
  };
  common: CommonType;
}

interface IDeviceContractSettings {
  mint_signers: string[];
  devices_limit: TIotDeviceType[];
}

interface ISqlToken {
  id?: string;

  mint: string;

  symbol: string;

  name: string;

  icon: string;

  is_stable?: boolean;
}
