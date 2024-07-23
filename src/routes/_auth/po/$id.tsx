import { getDetailPo } from '@/adapters/po';
import NavigationBack from '@/components/common/navigation-back';
import { QUERY_KEYS } from '@/utils/constants';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Flex, Typography } from 'antd';

const poQueryOptions = (id: string) =>
  queryOptions({
    queryKey: [QUERY_KEYS.GET_PO, id],
    queryFn: () => getDetailPo(id),
  });
export const Route = createFileRoute('/_auth/po/$id')({
  loader: ({ context, params: { id } }) => {
    const { queryClient } = context as any;
    return queryClient.ensureQueryData(poQueryOptions(id));
  },
  component: () => <PODetail />,
});
const PODetail = () => {
  const id = Route.useParams().id;
  const { data } = useSuspenseQuery(poQueryOptions(id));
  return (
    <>
      <NavigationBack />
      <Flex vertical gap={10}>
        <Flex vertical gap={5} align="start">
          <Typography.Text type="secondary">Name:</Typography.Text>

          <span className="profile-value">{data.profile_name}</span>
        </Flex>
        <Flex vertical gap={5} align="start">
          <Typography.Text type="secondary">Email:</Typography.Text>

          <span className="profile-value">{data.user_name}</span>
        </Flex>
        <Flex vertical gap={5} align="start">
          <Typography.Text type="secondary">Wallet:</Typography.Text>

          <span className="profile-value">{data.wallet}</span>
        </Flex>
        <Flex vertical gap={5} align="start">
          <Typography.Text type="secondary">Info:</Typography.Text>

          <span className="profile-value">{data.info}</span>
        </Flex>
      </Flex>
    </>
  );
};
