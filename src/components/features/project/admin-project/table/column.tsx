import { Space, TableColumnsType } from 'antd';
import { NavLink } from 'react-router-dom';

const columns: TableColumnsType<IProject> = [
  {
    title: 'ID',
    dataIndex: '_id',
  },
  {
    title: 'Name',
    render: (data: IProject) => <NavLink to={data._id}>{data.name}</NavLink>,
  },
  {
    title: 'Location',
    dataIndex: 'location',
  },
  {
    title: 'Start Date',
    dataIndex: 'startDate',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    filters: [
      {
        text: 'Active',
        value: true,
      },
      {
        text: 'Inactive',
        value: false,
      },
    ],
    render: (status: boolean) => <span>{status ? 'Active' : 'Inactive'}</span>,
    onFilter: (value, record) => record.status === value,
  },
  {
    title: 'Action',
    render: () => (
      <Space size="middle">
        <a>Edit</a>
        <a>Delete</a>
      </Space>
    ),
  },
];
export default columns;
