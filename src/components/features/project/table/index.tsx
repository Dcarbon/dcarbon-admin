import { Table } from 'antd';

import columns from './column';

const ProjectTableList = ({ data }: { data: IProject[] }) => {
  return (
    <Table
      columns={columns}
      pagination={{
        defaultPageSize: 10,
      }}
      dataSource={data}
    />
  );
};

export default ProjectTableList;
