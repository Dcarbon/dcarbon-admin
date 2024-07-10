import { Link } from '@tanstack/react-router';
import { Space, TableColumnsType } from 'antd';

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
      render: (status: boolean) => <span>{status}</span>,
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
