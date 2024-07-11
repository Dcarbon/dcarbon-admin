import { TableColumnsType, Tag } from 'antd';

const renderTag = (data: string) => {
  switch (data) {
    case 'active':
      return <Tag color="green">{data}</Tag>;
    case 'de_active':
      return <Tag color="red">{data}</Tag>;
    case 'used':
      return <Tag color="blue">{data}</Tag>;
    default:
      return <Tag>{data}</Tag>;
  }
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
    render: (status) => <span>{renderTag(status)}</span>,
  },
];
export default columns;
