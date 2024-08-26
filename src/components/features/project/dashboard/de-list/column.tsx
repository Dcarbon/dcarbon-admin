import { TableColumnsType } from 'antd';
import { DeviceDataType } from '@/types/device';
import CopyToClipBroad from '@components/common/copy';
import { truncateText } from '@utils/helpers';
import { getExplorerUrl } from '@utils/wallet';

const columns: TableColumnsType<DeviceDataType> = [
  {
    title: 'Key',
    dataIndex: 'key',
    key: 'key',
    render: (key: string) => (
      <span style={{ display: 'flex' }}>
        {truncateText(key)} <CopyToClipBroad text={key} type="icon" />
      </span>
    ),
  },
  {
    title: 'Mint',
    dataIndex: 'mint',
    key: 'mint',
    render: (mint: string) => (
      <span className={'contract-token-mint-address'}>
        <a href={getExplorerUrl(mint, 'address')} target="_blank">
          {truncateText(mint)}
        </a>
        <CopyToClipBroad text={mint} type="icon" />
      </span>
    ),
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (name: string) => <span style={{ fontWeight: '500' }}>{name}</span>,
  },
  {
    title: 'Remaining',
    dataIndex: 'available',
    key: 'available',
    render: (available: number) => (
      <span
        style={{ fontWeight: 'bold', color: 'var(--submit-button-bg-hover)' }}
      >
        {available.toFixed(2)}
      </span>
    ),
  },
];
export default columns;
