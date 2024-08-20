import { Link } from '@tanstack/react-router';
import { Space, TableColumnsType, Typography } from 'antd';
import CopyToClipBroad from '@components/common/copy';
import { truncateText } from '@utils/helpers';

import logo from '/dcarbon-logo.svg';

const columns: TableColumnsType<ITransactionTable> = [
  {
    title: 'Mint',
    dataIndex: 'mint',
    render: (mint: string) => (
      <span style={{ display: 'flex' }}>
        {truncateText(mint)} <CopyToClipBroad text={mint} type="icon" />
      </span>
    ),
    key: 'date',
  },
  {
    title: 'Name',
    width: '20%',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Symbol',
    width: '20%',
    dataIndex: 'symbol',
    key: 'symbol',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    width: '20%',
    key: 'amount',
    render: (amount: number) => (
      <Space wrap>
        <img src={logo} alt="logo" width={24} height={24} />
        <Typography.Text>{Number(amount.toFixed(1))}</Typography.Text>
        <span style={{ fontSize: '12px', color: '#595959' }}>CARBON</span>
      </Space>
    ),
  },
  {
    title: 'Mint time',
    dataIndex: 'mint_time',
    render: (time: string) =>
      time && (
        <span style={{ display: 'flex' }}>
          {new Date(time).toLocaleString()}
        </span>
      ),
    key: 'date',
  },
  {
    title: 'Action',
    width: '10%',
    align: 'center',
    dataIndex: 'token_account',
    render: (tokenAccount: string) => {
      return (
        <Space size="middle">
          <Link
            target={'_blank'}
            to={`${import.meta.env.VITE_SOLANA_EXPLORER}/address/${tokenAccount}?cluster=${import.meta.env.VITE_STAGE === 'prod' ? 'mainnet' : 'devnet'}`}
          >
            View
          </Link>
        </Space>
      );
    },
  },
];

export { columns };
