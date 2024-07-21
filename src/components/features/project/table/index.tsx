import { IProjectPage, ProjectList } from '@/types/projects';
import MyTable from '@components/common/table/my-table.tsx';
import projectColumns from '@components/features/project/table/column';

const ProjectTableList = ({ data }: { data: IProjectPage }) => {
  const columns = projectColumns();
  return (
    <MyTable
      columns={columns}
      pagination={{
        defaultPageSize: 10,
      }}
      rowKey={'id'}
      dataSource={data.data as ProjectList[]}
    />
  );
};

export default ProjectTableList;
