import { Link } from '@tanstack/react-router';
import { Space, TableColumnsType, Tag } from 'antd';
import { getCode } from 'country-list';
import ReactCountryFlag from 'react-country-flag';
import { ProjectList } from '@/types/projects';
import SpanOneLine from '@components/common/span/oneline-span.tsx';

const renderTag = (data: string) => {
  let color = 'green';
  switch (data) {
    case 'active':
      color = 'green';
      break;
    case 'inactive':
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
      width: 400,
      render: ({ country, location }: ProjectList) =>
        country?.code && (
          <SpanOneLine width={'400px'} style={{ paddingRight: '15px' }}>
            <ReactCountryFlag
              style={{ marginRight: '5px' }}
              countryCode={getCode(country?.code)?.toString() || 'VN'}
              svg
            />
            {country?.name}
            {location?.name ? `, ${location?.name}` : ''}
          </SpanOneLine>
        ),
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
          text: 'Inactive',
          value: 'inactive',
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
