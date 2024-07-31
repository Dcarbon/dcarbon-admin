import { memo } from 'react';
import {
  DollarOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { Tabs } from 'antd';
import ContractConfig from '@components/features/contract/config';
import FungibleToken from '@components/features/contract/fungible-token';
import ContractRole from '@components/features/contract/role';

export const Route = createFileRoute('/_auth/contract/')({
  validateSearch: (
    search: Record<string, unknown>,
  ): { tab?: string | number } => {
    return {
      ...search,
    };
  },
  component: () => <ContractPage />,
});
const ContractPage = memo(() => {
  const navigate = useNavigate();
  const search = useSearch({ from: '/_auth/contract/' });
  return (
    <Tabs
      defaultActiveKey={search.tab?.toString() || '1'}
      size={'large'}
      className="contract-tabs"
      destroyInactiveTabPane
      onChange={(key) => navigate({ search: { tab: +key } })}
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
  );
});
