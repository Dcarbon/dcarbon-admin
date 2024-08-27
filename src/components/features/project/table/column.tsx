import { EMintScheduleType, EProjectStatus } from '@/enums';
import { LoadingOutlined } from '@ant-design/icons';
import { MINT_SCHEDULE_TYPE } from '@constants/common.constant.ts';
import { Link } from '@tanstack/react-router';
import { Flex, Space, Spin, TableColumnsType, Tag } from 'antd';
import ReactCountryFlag from 'react-country-flag';
import { ProjectList } from '@/types/projects';
import SpanOneLine from '@components/common/span/oneline-span.tsx';

const renderStatus = (
  projectId: string,
  status: EProjectStatus,
  modifyStatus: (projectId: string, status: EProjectStatus) => void,
  modifyStatusLoading: string,
) => {
  return projectId !== modifyStatusLoading ? (
    <Space>
      <Tag
        onClick={() => modifyStatus(projectId, EProjectStatus.PrjS_None)}
        color={status !== EProjectStatus.PrjS_None ? 'default' : 'red'}
        style={{
          textTransform: 'capitalize',
          textAlign: 'center',
          fontSize: '12px',
          color: status !== EProjectStatus.PrjS_None ? 'gray' : 'red',
          cursor: 'pointer',
        }}
      >
        {'Inactive'}
      </Tag>
      <Tag
        onClick={() => modifyStatus(projectId, EProjectStatus.PrjS_Register)}
        color={status !== EProjectStatus.PrjS_Register ? 'default' : 'blue'}
        style={{
          textTransform: 'capitalize',
          textAlign: 'center',
          fontSize: '12px',
          color: status !== EProjectStatus.PrjS_Register ? 'gray' : 'blue',
          cursor: 'pointer',
        }}
      >
        {'Register'}
      </Tag>
      <Tag
        onClick={() => modifyStatus(projectId, EProjectStatus.PrjS_Success)}
        color={status !== EProjectStatus.PrjS_Success ? 'default' : 'green'}
        style={{
          textTransform: 'capitalize',
          textAlign: 'center',
          fontSize: '12px',
          color: status !== EProjectStatus.PrjS_Success ? 'gray' : 'green',
          cursor: 'pointer',
        }}
      >
        {'Active'}
      </Tag>
    </Space>
  ) : (
    <Flex justify={'center'} align={'center'}>
      <Spin indicator={<LoadingOutlined spin />} size="default" />
    </Flex>
  );
};
const renderMintingSchedule = (data: EMintScheduleType) => {
  let color = 'red';
  const match = MINT_SCHEDULE_TYPE.find((info) => info.type === data);
  const text = match ? match.name : 'Unset';
  switch (data) {
    case EMintScheduleType.DAILY:
      color = 'green';
      break;
    case EMintScheduleType.WEEKLY:
      color = 'orange';
      break;
    case EMintScheduleType.MONTHLY:
      color = 'purple';
      break;
    case EMintScheduleType.YEARLY:
      color = 'magenta';
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

interface IProps {
  modifyStatus: (projectId: string, status: EProjectStatus) => void;
  modifyStatusLoading: string;
}

const PoColumn = ({ modifyStatus, modifyStatusLoading }: IProps) => {
  const columns: TableColumnsType<ProjectList> = [
    {
      title: 'ID',
      width: 100,
      dataIndex: 'id',
    },
    {
      title: 'Name',
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
      align: 'center',
      dataIndex: 'mint_schedule',
      render: (mintSchedule) => (
        <span>{renderMintingSchedule(mintSchedule)}</span>
      ),
    },
    {
      title: 'Status',
      width: 250,
      align: 'center',
      render: (data: ProjectList) => (
        <span>
          {renderStatus(
            data.slug,
            data.status,
            modifyStatus,
            modifyStatusLoading,
          )}
        </span>
      ),
    },
    {
      title: 'Action',
      width: 100,
      align: 'center',
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
