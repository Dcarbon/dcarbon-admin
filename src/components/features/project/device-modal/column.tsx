import { TableColumnsType, Tag } from 'antd';

const renderStatus = (status: TDeviceStatus) => {
  let color = 'green';
  let text = 'Active';
  switch (status) {
    case 'de_active':
      color = 'red';
      text = 'De Active';
      break;
    case 'used':
      color = 'blue';
      text = 'Used';
      break;
  }
  return (
    <Tag style={{ minWidth: '100px', textAlign: 'center' }} color={color}>
      {text}
    </Tag>
  );
};

const columns: TableColumnsType<DeviceDataType> = [
  {
    title: 'ID',
    dataIndex: 'iot_device_id',
    key: 'iot_device_id',
  },
  {
    title: 'Name',
    dataIndex: 'device_name',
    key: 'device_name',
  },
  {
    title: 'Type',
    dataIndex: 'device_type',
    key: 'device_type',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: TDeviceStatus) => renderStatus(status),
  },
];
export default columns;
