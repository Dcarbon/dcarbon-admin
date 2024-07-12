import { SafetyCertificateOutlined, SettingOutlined } from '@ant-design/icons';
import { createFileRoute } from '@tanstack/react-router';
import { Tabs } from 'antd';
import ContractConfig from '@components/features/contract/config';
import ContractRole from '@components/features/contract/role';

export const Route = createFileRoute('/_auth/contract/')({
  component: () => <ContractPage />,
});

const ContractPage = () => {
  return (
    <div>
      <Tabs
        defaultActiveKey="1"
        size={'large'}
        items={[SettingOutlined, SafetyCertificateOutlined].map((Icon, i) => {
          const id = String(i + 1);
          return {
            key: id,
            label: i === 0 ? `Config` : `Role`,
            children: i === 0 ? <ContractConfig /> : <ContractRole />,
            icon: <Icon size={50} />,
          };
        })}
      />
    </div>
  );
};
