'use client';

import { useState } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  Avatar,
  Button,
  Collapse,
  CollapseProps,
  Divider,
  Flex,
  Modal,
  Space,
  Tag,
} from 'antd';

function NotConnectButton() {
  const { wallets, select, connecting } = useWallet();
  const [open, setOpen] = useState(false);

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  if (connecting) {
    return (
      <Button type="primary" loading={true}>
        Connecting
      </Button>
    );
  }

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Other Wallets',
      children: (
        <Flex wrap gap={10}>
          {wallets
            .filter((wl) => !['Phantom'].includes(wl.adapter.name))
            .map((wl) => {
              return (
                <button
                  className="btn-select-wallet"
                  key={wl.adapter.name}
                  onClick={async () => {
                    try {
                      select(wl.adapter.name);
                    } catch (e) {
                      console.error(e);
                    } finally {
                      onClose();
                    }
                  }}
                >
                  <Flex justify="space-between">
                    <Space size={'middle'}>
                      <Avatar
                        shape="square"
                        src={wl.adapter.icon}
                        alt={wl.adapter.name}
                        size={42}
                      />
                      <Flex justify="start" align="start" vertical>
                        {wl.adapter.name}
                      </Flex>
                    </Space>
                    <Space>
                      <RightOutlined />
                    </Space>
                  </Flex>
                </button>
              );
            })}
        </Flex>
      ),
      extra: (
        <>
          <div>
            {wallets
              .filter((wl) => !['Phantom'].includes(wl.adapter.name))
              .slice(0, 3)
              ?.map((icon) => (
                <Avatar
                  key={icon.adapter.name}
                  src={icon.adapter.icon}
                  size={24}
                  alt={icon.adapter.name}
                />
              ))}
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={onOpen}>
        Connect to wallet
      </Button>
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        width={380}
        title={
          <Space size={'small'} align="center">
            <img
              src="/public/image/wallet.svg"
              width={40}
              height={40}
              alt="wallet"
              draggable={false}
            />
            Connect to a wallet
          </Space>
        }
        centered
      >
        <div>
          {wallets
            .filter((wl) => ['Phantom'].includes(wl.adapter.name))
            .map((wl) => {
              return (
                <button
                  className="btn-select-wallet"
                  key={wl.adapter.name}
                  onClick={async () => {
                    try {
                      select(wl.adapter.name);
                    } catch (e) {
                      console.error(e);
                    } finally {
                      onClose();
                    }
                  }}
                >
                  <Flex justify="space-between">
                    <Space size={'middle'}>
                      <Avatar
                        shape="square"
                        src={wl.adapter.icon}
                        alt={wl.adapter.name}
                        size={42}
                      />
                      <Flex justify="start" align="start" vertical>
                        {wl.adapter.name}
                        <Tag
                          color="rgba(0, 222, 242, 0.1)"
                          className="text-recomended-black"
                        >
                          (Recommended)
                        </Tag>
                      </Flex>
                    </Space>
                    <Space>
                      <div>
                        {wl.readyState === WalletReadyState.Installed ? (
                          wl.adapter.connected ? (
                            <Tag color="success">Connected</Tag>
                          ) : (
                            <Tag color="warning">Detected</Tag>
                          )
                        ) : (
                          <Tag color="danger">Not Installed</Tag>
                        )}
                      </div>
                      <RightOutlined />
                    </Space>
                  </Flex>
                </button>
              );
            })}

          <Divider />

          <Collapse items={items} />
        </div>
      </Modal>
    </>
  );
}

export default NotConnectButton;
