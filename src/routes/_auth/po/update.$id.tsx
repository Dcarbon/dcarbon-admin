import { getDetailPo, updatePo } from '@/adapters/po';
import CancelButtonAction from '@/components/common/button/button-cancel';
import SubmitButtonAction from '@/components/common/button/button-submit';
import MyInput from '@/components/common/input/my-input';
import MyInputTextArea from '@/components/common/input/my-textarea';
import CenterContentLayout from '@/components/common/layout/center-content/center-content.layout';
import { QUERY_KEYS } from '@/utils/constants';
import useModalAction from '@/utils/helpers/back-action';
import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { App, Flex, Form, message, Typography } from 'antd';

const poQueryOptions = (id: string) =>
  queryOptions({
    queryKey: [QUERY_KEYS.GET_PO, id],
    queryFn: () => getDetailPo(id),
  });
export const Route = createFileRoute('/_auth/po/update/$id')({
  loader: ({ context, params: { id } }) => {
    const { queryClient } = context as any;
    return queryClient.ensureQueryData(poQueryOptions(id));
  },
  component: () => <UpdatePo />,
});
const UpdatePo = () => {
  const id = Route.useParams().id;
  const { data } = useSuspenseQuery(poQueryOptions(id));
  const [form] = Form.useForm();
  const goBack = useModalAction({
    type: 'back',
    danger: true,
  });
  const param = useParams({
    from: '/_auth/po/update/$id',
    select: (params) => ({ id: params.id }),
  });
  const { notification } = App.useApp();
  const querycClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: (value: { [key: string]: string }) => updatePo(value, param.id),
    onSuccess: () => {
      querycClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PO, param.id],
      });
      message.success('Update successfully');
    },
    onError: (err: any) => {
      notification.error({
        message: 'Update failed',
        description: err.message || 'Something went wrong',
      });
    },
  });
  return (
    <CenterContentLayout>
      <Typography.Title level={2}>Update PO</Typography.Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          Object.keys(values).forEach((key) => {
            if (data[key as keyof IPo] === values[key]) {
              delete values[key];
            }
          });
          updateMutation.mutate(values);
        }}
        style={{ width: '100%' }}
        initialValues={{
          ...data,
        }}
      >
        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item
            label="Name"
            name="profile_name"
            rules={[
              {
                required: true,
                max: 255,
              },
            ]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <MyInput
              placeholder="Enter PO name"
              maxLength={255}
              style={{ backgroundColor: 'var(--main-gray)' }}
            />
          </Form.Item>
          <Form.Item
            label="Email"
            name="user_name"
            rules={[
              {
                type: 'email',
                required: true,
              },
            ]}
            style={{
              display: 'inline-block',
              width: 'calc(50%)',
              margin: '0px 0px 0px 8px',
            }}
          >
            <MyInput placeholder="Enter PO email" />
          </Form.Item>
        </Form.Item>
        <Form.Item
          label="Wallet"
          name="wallet"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <MyInput placeholder="Enter PO wallet" />
        </Form.Item>
        <Form.Item
          label="Info"
          name="info"
          rules={[
            {
              required: true,
              max: 5000,
            },
          ]}
        >
          <MyInputTextArea
            placeholder="Enter PO info"
            maxLength={5000}
            rows={10}
          />
        </Form.Item>
        <Flex gap={10} justify="center">
          <SubmitButtonAction loading={updateMutation.isPending}>
            Submit
          </SubmitButtonAction>
          <CancelButtonAction
            disabled={updateMutation.isPending}
            onClick={goBack}
          >
            Cancel
          </CancelButtonAction>
        </Flex>
      </Form>
    </CenterContentLayout>
  );
};
