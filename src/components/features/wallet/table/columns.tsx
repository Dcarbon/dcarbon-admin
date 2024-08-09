import {
  Button,
  Dropdown,
  MenuProps,
  Space,
  TableColumnsType,
  Typography,
} from 'antd';

import imgAction from '/image/icon-action.svg';

const items: MenuProps['items'] = [
  {
    label: 'Action',
    key: '1',
  },
];
const columns: TableColumnsType<ITransactionTable> = [
  {
    title: 'Date',
    dataIndex: 'tx_date_time',
    render: (date: string) => new Date(date).toLocaleString(),
    key: 'date',
  },
  {
    title: 'Account',
    dataIndex: 'account',
    key: 'account',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    render: (type: string) => <span className="transactions-type">{type}</span>,
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render: (amount: number) => (
      <Space wrap>
        <Typography.Text>${amount}</Typography.Text>
      </Space>
    ),
  },
  {
    width: 50,
    render: () => (
      <Space wrap>
        <Dropdown menu={{ items }} trigger={['click']}>
          <Button type="text">
            <img src={imgAction} alt="" />
          </Button>
        </Dropdown>
      </Space>
    ),
  },
];

export { columns };
