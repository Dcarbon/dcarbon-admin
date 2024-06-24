import { useWallet } from '@solana/wallet-adapter-react';
import { Avatar, Button, Dropdown, MenuProps } from 'antd';

function ConnectedButton() {
  const { publicKey, connected, wallet, disconnect, disconnecting } =
    useWallet();

  if (!publicKey || !connected || !wallet) {
    return null;
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <button onClick={disconnect}>Disconnect</button>,
    },
  ];

  return (
    <Dropdown menu={{ items }}>
      <Button
        loading={disconnecting}
        icon={<Avatar src={wallet.adapter.icon} alt="icon" size={20} />}
      >
        {(publicKey?.toBase58()?.slice(0, 5) || '') +
          '...' +
          (publicKey?.toBase58()?.slice(-5) || '')}
      </Button>
    </Dropdown>
  );
}

export default ConnectedButton;
