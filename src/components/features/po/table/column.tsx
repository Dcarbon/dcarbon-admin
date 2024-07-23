import CopyToClipBroad from '@/components/common/copy';
import { truncateText } from '@/utils/helpers/common';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Button, Flex, Space, TableColumnsType, Tag } from 'antd';

import '../po.css';

const renderTag = (data: string) => {
  let color = 'green';
  switch (data) {
    case 'active':
      color = 'green';
      break;
    case 'inactive':
      color = 'orange';
      break;
    case 'banned':
      color = 'magenta';
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
export type TLoadingActionState = {
  action: 'ban' | 'delete' | 'unban';
  id: string;
};

interface IProps {
  handlePo: (action: 'ban' | 'delete' | 'unban', id: string) => void;
  loadingHandleAction?: TLoadingActionState;
}

const PoColumn = ({ handlePo, loadingHandleAction }: IProps) => {
  const search = useSearch({ from: '/_auth/po/' });
  const navigate = useNavigate();
  const columns: TableColumnsType<PoList> = [
    {
      title: 'Name',
      dataIndex: 'profile_name',
      width: 200,
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
      width: 250,
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
      width: 150,
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
      width: 70,
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
      render: ({ id, status }: IPo) => {
        const isDelete =
          loadingHandleAction?.id === id &&
          loadingHandleAction?.action === 'delete';
        const isBaned =
          loadingHandleAction?.id === id &&
          (loadingHandleAction?.action === 'ban' ||
            loadingHandleAction?.action === 'unban');
        return (
          <Space size={'middle'}>
            <Button
              onClick={() =>
                navigate({
                  to: '/po/$id',
                  params: {
                    id: id,
                  },
                })
              }
              icon={<EyeOutlined />}
            />
            <Button
              onClick={() =>
                navigate({
                  to: '/po/update/$id',
                  params: {
                    id: id,
                  },
                })
              }
              disabled={status === 'deleted'}
              icon={<EditOutlined />}
            />
            <Button
              type={status === 'banned' ? 'default' : 'primary'}
              className={isBaned || status === 'banned' ? '' : 'danger-btn'}
              danger={status !== 'banned'}
              icon={<StopOutlined />}
              loading={isBaned}
              disabled={isBaned || status === 'deleted'}
              onClick={() =>
                handlePo(status === 'banned' ? 'unban' : 'ban', id)
              }
            />
            <Button
              type={'primary'}
              className={isDelete ? '' : 'danger-btn'}
              danger
              disabled={isDelete || status === 'deleted'}
              loading={isDelete}
              icon={<DeleteOutlined />}
              onClick={() => handlePo('delete', id)}
            />
          </Space>
        );
      },
    },
  ];
  return columns;
};

export default PoColumn;
