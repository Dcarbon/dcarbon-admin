import { memo } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import MyTable from '@components/common/table/my-table.tsx';

import { columns } from './columns';

const TransactionTable = memo(({ data }: { data: TransactionPages }) => {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/_auth/wallet/' });

  return (
    <>
      <MyTable
        columns={columns}
        dataSource={data?.data as ITransactionTable[]}
        scroll={{ y: 500 }}
        tableLayout="auto"
        rowKey={'tx_id'}
        size="middle"
        pagination={{
          pageSize: 12,
          current: data?.paging?.page || 1,
          total: data?.paging?.total || 1,
          showSizeChanger: false,
          onChange: (page) => {
            navigate({
              from: '/wallet',
              to: '/wallet',
              search: {
                ...searchParams,
                page,
              },
            });
          },
        }}
      />
    </>
  );
});
export default TransactionTable;
