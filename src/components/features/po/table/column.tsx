import CopyToClipBroad from '@/components/common/copy';
import { truncateText } from '@/utils/helpers/common';
import { useSearch } from '@tanstack/react-router';
import { Flex, TableColumnsType, Tag } from 'antd';

const renderTag = (data: string) => {
  let color = 'green';
  switch (data) {
    case 'active':
      color = 'green';
      break;
    case 'un_active':
      color = 'orange';
      break;
    case 'banned':
      color = 'gray';
      break;
    case 'deleted':
      color = 'red';
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
  const search = useSearch({ from: '/_auth/po/' });

  const columns: TableColumnsType<PoList> = [
    {
      title: 'Name',
      dataIndex: 'profile_name',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      defaultSortOrder:
        search.sort_field === 'profile_name'
          ? search.sort_type === 'asc'
            ? 'ascend'
            : 'descend'
          : undefined,
    },
    {
      title: 'Email',
      dataIndex: 'user_name',
      sorter: true,
      defaultSortOrder:
        search.sort_field === 'user_name'
          ? search.sort_type === 'asc'
            ? 'ascend'
            : 'descend'
          : undefined,
    },
    {
      title: 'Wallet',
      width: 250,
      dataIndex: 'wallet',
      render: (wallet: string) => (
        <Flex justify="space-between" align="center" gap={10}>
          {' '}
          {truncateText(wallet)} <CopyToClipBroad text={wallet} type="icon" />
        </Flex>
      ),
    },
    {
      title: 'Status',
      width: 150,
      dataIndex: 'status',
      sorter: true,
      render: (status) => <span>{renderTag(status)}</span>,
      defaultSortOrder:
        search.sort_field === 'status'
          ? search.sort_type === 'asc'
            ? 'ascend'
            : 'descend'
          : undefined,
    },
    {
      title: 'Action',
      width: 150,
      render: () => <div></div>,
    },
  ];
  return columns;
};

export default PoColumn;
