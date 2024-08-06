import { EMintScheduleType } from '@/enums';
import { MINT_SCHEDULE_TYPE } from '@constants/common.constant.ts';
import { Link } from '@tanstack/react-router';
import { Space, TableColumnsType, Tag } from 'antd';
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
const renderMintingSchedule = (data: EMintScheduleType) => {
  let color = 'red';
  const match = MINT_SCHEDULE_TYPE.find((info) => info.type === data);
  const text = match ? match.name : 'Unset';
  switch (data) {
    case EMintScheduleType.WEEKLY:
      color = 'orange';
      break;
    case EMintScheduleType.MONTHLY:
      color = 'purple';
      break;
    case EMintScheduleType.DAILY:
      color = 'green';
      break;
  }
  return (
    <Tag
      color={color}
      style={{
        minWidth: '63px',
        textAlign: 'center',
        fontSize: '12px',
      }}
    >
      {text}
    </Tag>
  );
};
const PoColumn = () => {
  const columns: TableColumnsType<ProjectList> = [
    {
      title: 'Name',
      width: 400,
      dataIndex: 'project_name',
    },
    {
      title: 'Location',
      render: ({ country, location }: ProjectList) =>
        country?.code && (
          <SpanOneLine width={'400px'} style={{ paddingRight: '15px' }}>
            <ReactCountryFlag
              style={{ marginRight: '5px' }}
              countryCode={country?.code || 'VN'}
              svg
            />
            {country?.name}
            {location?.name ? `, ${location?.name}` : ''}
          </SpanOneLine>
        ),
    },
    {
      title: 'Minting Schedule',
      width: 170,
      dataIndex: 'mint_schedule',
      render: (mintSchedule) => (
        <span>{renderMintingSchedule(mintSchedule)}</span>
      ),
    },
    {
      title: 'Status',
      width: 170,
      dataIndex: 'status',
      render: (status) => <span>{renderTag(status)}</span>,
    },
    {
      title: 'Action',
      width: 150,
      render: (data: ProjectList) => {
        return (
          <Space size="middle">
            <Link
              to="/project/$slug"
              from={'/project'}
              params={{ slug: data.slug }}
            >
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
