import Claimed from '@/components/features/wallet/claimed';
import Owned from '@/components/features/wallet/owned';
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { Tabs, TabsProps } from 'antd';

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
      key: 'claimed',
      label: 'Claimed',
      children: <Claimed />,
    },
    {
      key: 'owned',
      label: 'Owned',
      children: <Owned />,
    },
  ];
  return (
    <Tabs
      items={tabItem}
      activeKey={searchParams.tab}
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
