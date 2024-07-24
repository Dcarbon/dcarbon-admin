import { EIotDeviceStatus } from '@/enums';
import { TableColumnsType, Tag } from 'antd';
import {
  DeviceDataType,
  TIotDeviceStatus,
  TIotDeviceType,
} from '@/types/device';

const renderTag = (data: TIotDeviceStatus) => {
  let color = 'orange';
  switch (data.id) {
    case EIotDeviceStatus.NONE:
      color = 'orange';
      break;
    case EIotDeviceStatus.REGISTER:
      color = 'geekblue';
      break;
    case EIotDeviceStatus.SUCCESS:
      color = 'green';
      break;
    case EIotDeviceStatus.REJECT:
      color = 'red';
      break;
  }
  return (
    <Tag
      style={{
        minWidth: '80px',
        textAlign: 'center',
        fontSize: '12px',
      }}
      color={color}
    >
      {data.name}
    </Tag>
  );
};

const columns: TableColumnsType<DeviceDataType> = [
  {
    title: 'ID',
    dataIndex: 'iot_device_id',
    key: 'iot_device_id',
    render: (value: string) => <span>{value}</span>,
  },
  {
    title: 'Name',
    dataIndex: 'device_name',
    key: 'device_name',
    render: (value: string) => <span>{value}</span>,
  },
  {
    title: 'Type',
    dataIndex: 'device_type',
    key: 'device_type',
    render: (type: TIotDeviceType) => (
      <Tag
        style={{
          minWidth: '98px',
          textAlign: 'center',
          fontSize: '12px',
        }}
        color={'blue'}
      >
        {type.name}
      </Tag>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: TIotDeviceStatus) => <span>{renderTag(status)}</span>,
  },
];
export default columns;
