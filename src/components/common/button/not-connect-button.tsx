'use client';

import { useState } from 'react';
import WalletIcon from '@/icons/wallet.icon.tsx';
import Icon, { RightOutlined } from '@ant-design/icons';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import { useWallet } from '@solana/wallet-adapter-react';
import { Avatar, Divider, Flex, Modal, Space, Tag } from 'antd';
import { createStyles } from 'antd-style';
import SubmitButton from '@components/common/button/submit-button.tsx';

const WalletIc = () => (
  <Icon size={20} component={() => <WalletIcon size={25} />} />
);

const useStyle = createStyles(() => ({
  'my-modal-mask': {
    boxShadow: `inset 0 0 15px #fff`,
  },
  'my-modal-content': {
    border: '1px solid #333',
  },
}));

function NotConnectButton() {
  const { wallets, select, connecting } = useWallet();
  const { styles } = useStyle();
  const [open, setOpen] = useState(false);
  const classNames = {
    mask: styles['my-modal-mask'],
    content: styles['my-modal-content'],
  };

  const modalStyles = {
    mask: {
      backdropFilter: 'blur(10px)',
    },
    content: {
      boxShadow: '0 0 30px #999',
      borderRadius: '12px',
    },
  };
  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  if (connecting) {
    return <SubmitButton loading={true}>Connecting</SubmitButton>;
  }

  return (
    <>
      <SubmitButton className="btn-wallet" icon={<WalletIc />} onClick={onOpen}>
        Connect
      </SubmitButton>
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        width={480}
        style={{ borderRadius: '12px' }}
        title={
          <Space
            size={'small'}
            align="center"
            style={{
              fontSize: '18px',
              marginBottom: '15px',
            }}
          >
            <img
              src="/image/wallet.svg"
              width={54}
              height={54}
              alt="wallet"
              draggable={false}
            />
            Connect Wallet
          </Space>
        }
        centered
        classNames={classNames}
        styles={modalStyles}
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
                        <Tag className="text-recomended-black">
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
                            <Tag className={'wallet-modal-detect-tag'}>
                              Detected
                            </Tag>
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
          <span
            style={{
              marginBottom: '10px',
              fontWeight: '400',
              display: 'block',
            }}
          >
            Other Wallets
          </span>
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
        </div>
      </Modal>
    </>
  );
}

export default NotConnectButton;
