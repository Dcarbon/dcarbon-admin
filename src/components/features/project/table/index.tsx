import { Table } from 'antd';
import projectColumns from '@components/features/project/table/column';

const ProjectTableList = ({ data }: { data: IProjectPage }) => {
  const columns = projectColumns();
  return (
    <Table
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
