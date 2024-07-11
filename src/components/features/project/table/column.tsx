import { Link } from '@tanstack/react-router';
import { Space, TableColumnsType, Tag } from 'antd';

const renderTag = (data: string) => {
  switch (data) {
    case 'active':
      return <Tag color="green">{data}</Tag>;
    case 'deactive':
      return <Tag color="red">{data}</Tag>;
    case 'draft':
      return <Tag color="gray">{data}</Tag>;
    default:
      return <Tag>{data}</Tag>;
  }
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
