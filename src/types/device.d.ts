type CommonType = {
  iot_device_types: string[];
  iot_device_status: string[];
};

type DeviceDataType = {
  iot_device_id: string;
  device_name: string;
  device_type: string;
  status: 'active' | 'de_active';
};

interface IDeviceRequest {
  page?: number;
  limit?: number;
  sort_field?: string;
  sort_type?: 'asc' | 'desc';
  id?: string;
  type?: string;
  status?: string;
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
