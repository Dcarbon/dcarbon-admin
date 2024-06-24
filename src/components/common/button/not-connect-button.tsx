'use client';

import { useState } from 'react';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import { useWallet } from '@solana/wallet-adapter-react';
import { Avatar, Button, Collapse, CollapseProps, Divider, Modal } from 'antd';

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
        <>
          {wallets
            .filter((wl) => !['Phantom'].includes(wl.adapter.name))
            .map((wl) => {
              return (
                <button
                  className="w-full py-2 px-2"
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
                  <div className="flex gap-2 justify-between items-center flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="min-w-9">
                        <Avatar
                          src={wl.adapter.icon}
                          alt={wl.adapter.name}
                          size={32}
                        />
                      </div>
                      {wl.adapter.name}
                    </div>
                    {wl.readyState === WalletReadyState.Installed ? (
                      wl.adapter.connected ? (
                        <div color="success">Connected</div>
                      ) : (
                        <div color="warning">Detected</div>
                      )
                    ) : (
                      <div color="danger">Not Installed</div>
                    )}
                  </div>
                </button>
              );
            })}
        </>
      ),
      extra: (
        <>
          <div className="flex gap-1">
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
        title="Connect to wallet"
        centered
      >
        <div className="flex flex-col">
          {wallets
            .filter((wl) => ['Phantom'].includes(wl.adapter.name))
            .map((wl) => {
              return (
                <button
                  className="hover:bg-kyu-color-2 py-2 px-2"
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
                  <div className="flex gap-2 justify-between items-center flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="min-w-9">
                        <Avatar
                          src={wl.adapter.icon}
                          alt={wl.adapter.name}
                          size={32}
                        />
                      </div>
                      {wl.adapter.name}
                    </div>

                    <div className="flex gap-4">
                      <div color="success">Recommended</div>

                      <div className="hidden sm:block">
                        {wl.readyState === WalletReadyState.Installed ? (
                          wl.adapter.connected ? (
                            <div color="success">Connected</div>
                          ) : (
                            <div color="warning">Detected</div>
                          )
                        ) : (
                          <div color="danger">Not Installed</div>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}

          <Divider className="mt-4" />

          <Collapse items={items} />
        </div>
      </Modal>
    </>
  );
}

export default NotConnectButton;
