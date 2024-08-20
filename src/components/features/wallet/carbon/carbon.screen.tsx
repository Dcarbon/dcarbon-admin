import { memo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { SplToken } from '@/types/projects';
import MyTable from '@components/common/table/my-table.tsx';
import { ROUTES_URL } from '@utils/constants';

import { columns } from './columns';

interface IProps {
  loading?: boolean;
  claimInfo: SplToken[];
  searchParams: object;
  paging?: {
    page: number;
    total: number;
    limit: number;
  };
}

const CarbonScreen = memo(
  ({ loading, claimInfo, paging, searchParams }: IProps) => {
    const navigate = useNavigate();
    return (
      <>
        <MyTable
          loading={loading}
          columns={columns}
          dataSource={claimInfo || []}
          scroll={{ y: 500 }}
          tableLayout="auto"
          rowKey={'tx_id'}
          size="middle"
          pagination={{
            pageSize: 10,
            current: paging?.page || 1,
            total: paging?.total || 1,
            showSizeChanger: false,
            onChange: (page) => {
              navigate({
                from: ROUTES_URL.WALLET,
                to: ROUTES_URL.WALLET,
                search: {
                  ...searchParams,
                  page,
                },
              }).then();
            },
          }}
        />
      </>
    );
  },
);
export default CarbonScreen;
