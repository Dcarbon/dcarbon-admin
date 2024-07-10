import { TableColumnsType, Tag } from 'antd';

const columns: TableColumnsType<DeviceDataType> = [
  {
    title: 'Device ID',
    dataIndex: 'iot_device_id',
    key: 'iot_device_id',
  },
  {
    title: 'Device Name',
    dataIndex: 'device_name',
    key: 'device_name',
  },
  {
    title: 'Device Type',
    dataIndex: 'device_type',
    key: 'device_type',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: 'active' | 'de_active') => (
      <Tag color={status === 'active' ? 'green' : 'red'}>{status}</Tag>
    ),
  },
];
export default columns;
