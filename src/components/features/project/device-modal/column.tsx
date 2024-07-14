import { TableColumnsType, Tag } from 'antd';

const renderTag = (data: string) => {
  let color = 'green';
  switch (data) {
    case 'active':
      color = 'green';
      break;
    case 'de_active':
      color = 'red';
      break;
    case 'used':
      color = 'blue';
      break;
  }
  return (
    <Tag
      style={{
        textTransform: 'capitalize',
        minWidth: '80px',
        textAlign: 'center',
        fontSize: '12px',
      }}
      color={color}
    >
      {data.replace('_', ' ')}
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
    render: (status) => <span>{renderTag(status)}</span>,
  },
];
export default columns;
