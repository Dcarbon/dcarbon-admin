import { getDetailPo } from '@/adapters/po';
import { QUERY_KEYS } from '@/utils/constants';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Form, Typography } from 'antd';
import MyInput from '@components/common/input/my-input.tsx';
import MyInputTextArea from '@components/common/input/my-textarea.tsx';
import CenterContentLayout from '@components/common/layout/center-content/center-content.layout.tsx';

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
    <CenterContentLayout>
      <Typography.Title level={2}>Information</Typography.Title>
      <Form layout="vertical" style={{ width: '100%' }} disabled={true}>
        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item
            label="Name"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <MyInput viewMode value={data?.profile_name} />
          </Form.Item>
          <Form.Item
            label="Email"
            style={{
              display: 'inline-block',
              width: 'calc(50%)',
              margin: '0px 0px 0px 8px',
            }}
          >
            <MyInput viewMode value={data?.user_name} />
          </Form.Item>
        </Form.Item>
        <Form.Item label="Wallet">
          <MyInput viewMode value={data?.wallet} />
        </Form.Item>
        <Form.Item label="Info">
          <MyInputTextArea viewMode value={data?.info} rows={10} />
        </Form.Item>
      </Form>
    </CenterContentLayout>
  );
};
