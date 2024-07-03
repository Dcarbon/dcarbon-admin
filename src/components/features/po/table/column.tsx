import CopyToClipBroad from '@/components/common/copy';
import { truncateText } from '@/utils/helpers/common';
import { useSearch } from '@tanstack/react-router';
import { Flex, TableColumnsType } from 'antd';

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
