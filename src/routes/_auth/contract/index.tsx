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
        defaultActiveKey="3"
        size={'large'}
        items={[SafetyCertificateOutlined, DollarOutlined, SettingOutlined].map(
          (Icon, i) => {
            const id = String(i + 1);
            let label = 'Role';
            let children = <ContractRole />;
            switch (i) {
              case 1:
                label = 'Fungible Token';
                children = <FungibleToken />;
                break;
              case 2:
                label = 'Config';
                children = <ContractConfig />;
                break;
            }
            return {
              key: id,
              label,
              children,
              icon: <Icon size={50} />,
            };
          },
        )}
      />
    </div>
  );
});
