import { useNavigate, useSearch } from '@tanstack/react-router';
import MyTable from '@components/common/table/my-table.tsx';
import columns from '@components/features/po/table/column';

const PoTableList = ({ data }: { data: IPoPage }) => {
  const navigate = useNavigate();
  const search = useSearch({ from: '/_auth/po/' });
  const col = columns();
  return (
    <MyTable
      columns={col}
      rowKey={'id'}
      pagination={{
        defaultPageSize: 10,
        current: data.paging.page || 1,
        total: data.paging.total,
      }}
      onChange={(page: any, _filters: any, sorter: any) => {
        return navigate({
          to: '/po',
          search: {
            ...search,
            page: page.current,
            sort_field: sorter.field,
            sort_type: sorter.order === 'ascend' ? 'asc' : 'desc',
          },
        });
      }}
      dataSource={data.data}
    />
  );
};

export default PoTableList;
