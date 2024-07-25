import { IProjectPage, ProjectList } from '@/types/projects';
import MyTable from '@components/common/table/my-table.tsx';
import projectColumns from '@components/features/project/table/column';

const ProjectTableList = ({ data }: { data: IProjectPage }) => {
  const columns = projectColumns();
  return (
    <MyTable
      columns={columns}
      scroll={{ y: '56vh' }}
      pagination={{
        defaultPageSize: data.paging.limit,
        total: data.paging.total,
        current: data.paging.page,
      }}
      rowKey={'id'}
      dataSource={data.data as ProjectList[]}
    />
  );
};

export default ProjectTableList;
