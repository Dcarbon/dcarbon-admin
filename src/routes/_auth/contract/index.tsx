import { memo } from 'react';
import {
  DollarOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { createFileRoute } from '@tanstack/react-router';
import { Tabs } from 'antd';
import ContractConfig from '@components/features/contract/config';
import FungibleToken from '@components/features/contract/fungible-token';
import ContractRole from '@components/features/contract/role';

export const Route = createFileRoute('/_auth/contract/')({
  component: () => <ContractPage />,
});
const ContractPage = memo(() => {
  return (
    <div>
      <Tabs
        defaultActiveKey="1"
        size={'large'}
        items={[DollarOutlined, SettingOutlined, SafetyCertificateOutlined].map(
          (Icon, i) => {
            const id = String(i + 1);
            let label = 'Fungible Token';
            let children = <FungibleToken />;
            switch (i) {
              case 1:
                label = 'Config';
                children = <ContractConfig />;
                break;
              case 2:
                label = 'Role';
                children = <ContractRole />;
                break;
            }
            return {
              key: id,
              label,
              children,
              icon: <Icon size={50} />,
              style: { height: 'calc(100vh - 230px)' },
            };
          },
        )}
      />
    </div>
  );
});
