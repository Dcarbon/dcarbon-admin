import {
  createFileRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { Tabs, TabsProps } from 'antd';
import CarbonContainer from '@components/features/wallet/carbon/carbon.container.tsx';
import DcarbonContainer from '@components/features/wallet/dcarbon/dcarbon.container.tsx';

export const Route = createFileRoute('/_auth/wallet/')({
  validateSearch: (
    search: Record<string, unknown>,
  ): { tab?: string; page?: number } => {
    return {
      ...search,
      page: Number(search?.page ?? 1),
    };
  },
  component: () => <Wallet />,
});

const Wallet = () => {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/_auth/wallet/' });
  const tabItem: TabsProps['items'] = [
    {
      key: 'carbon',
      label: 'Carbon',
      children: <CarbonContainer />,
    },
    {
      key: 'dcarbon',
      label: 'DCarbon',
      children: <DcarbonContainer />,
    },
  ];
  return (
    <Tabs
      items={tabItem}
      activeKey={searchParams.tab || 'dcarbon'}
      onChange={(tab) =>
        navigate({
          search: {
            tab,
          },
        })
      }
    />
  );
};
