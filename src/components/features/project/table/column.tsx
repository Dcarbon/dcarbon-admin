import { Link } from '@tanstack/react-router';
import { Space, TableColumnsType, Tag } from 'antd';

const renderTag = (data: string) => {
  let color = 'green';
  switch (data) {
    case 'active':
      color = 'green';
      break;
    case 'deactive':
      color = 'red';
      break;
    case 'draft':
      color = 'gray';
      break;
  }
  return (
    <Tag
      color={color}
      style={{
        textTransform: 'capitalize',
        minWidth: '80px',
        textAlign: 'center',
        fontSize: '12px',
      }}
    >
      {data.replace('_', ' ')}
    </Tag>
  );
};
const PoColumn = () => {
  const columns: TableColumnsType<ProjectList> = [
    {
      title: 'Name',
      dataIndex: 'project_name',
    },
    {
      title: 'Location',
      dataIndex: 'location',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      filters: [
        {
          text: 'Draft',
          value: 'draft',
        },
        {
          text: 'Deactive',
          value: 'deactive',
        },
        {
          text: 'Active',
          value: 'active',
        },
      ],
      render: (status) => <span>{renderTag(status)}</span>,
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Action',
      width: 150,
      render: (data: ProjectList) => {
        return (
          <Space size="middle">
            <Link to="/project/$slug" params={{ slug: data.slug }}>
              View
            </Link>
          </Space>
        );
      },
    },
  ];
  return columns;
};

export default PoColumn;
