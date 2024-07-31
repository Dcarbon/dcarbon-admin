import { useIsFetching } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { IProjectPage, ProjectList } from '@/types/projects';
import MyTable from '@components/common/table/my-table.tsx';
import projectColumns from '@components/features/project/table/column';

const ProjectTableList = ({ data }: { data: IProjectPage }) => {
  const columns = projectColumns();
  const search = useSearch({ from: '/_auth/project/' });
  const navigate = useNavigate();
  const isFetching = useIsFetching();
  const isLoading = isFetching > 0;

  return (
    <MyTable
      columns={columns}
      scroll={{ y: '56vh' }}
      id="id"
      loading={
        isLoading
          ? {
              spinning: isLoading || !data,
              indicator: <div />,
            }
          : false
      }
      rowKey={'id'}
      pagination={{
        pageSize: data?.paging?.limit || 12,
        defaultPageSize: 12,
        total: data?.paging?.total,
        current: data?.paging?.page,
        showSizeChanger: false,
      }}
      onChange={(page: any, _filters: any, sorter: any) => {
        return navigate({
          to: '/project',
          search: {
            ...search,
            page: page.current,
            sort_field: sorter.field,
            sort_type: sorter.order === 'ascend' ? 'asc' : 'desc',
          },
        });
      }}
      dataSource={data.data as ProjectList[]}
    />
  );
};

export default ProjectTableList;
