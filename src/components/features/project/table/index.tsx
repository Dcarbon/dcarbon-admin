import { useNavigate, useSearch } from '@tanstack/react-router';
import { Table } from 'antd';
import { IProjectPage, ProjectList } from '@/types/projects';
import projectColumns from '@components/features/project/table/column';

const ProjectTableList = ({ data }: { data: IProjectPage }) => {
  const columns = projectColumns();
  const search = useSearch({ from: '/_auth/project/' });
  const navigate = useNavigate();

  return (
    <Table
      columns={columns}
      scroll={{ y: '56vh' }}
      id="id"
      rowKey={'id'}
      pagination={{
        pageSize: data.paging.limit,
        defaultPageSize: 10,
        total: data.paging.total,
        current: data.paging.page,
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
