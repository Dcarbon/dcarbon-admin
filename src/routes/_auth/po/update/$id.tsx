import { getDetailPo, updatePo } from '@/adapters/po';
import CancelButtonAction from '@/components/common/button/button-cancel';
import SubmitButtonAction from '@/components/common/button/button-submit';
import MyInput from '@/components/common/input/my-input';
import MyInputTextArea from '@/components/common/input/my-textarea';
import CenterContentLayout from '@/components/common/layout/center-content/center-content.layout';
import NavigationBack from '@/components/common/navigation-back';
import { ERROR_MSG, SUCCESS_MSG } from '@/constants';
import { QUERY_KEYS } from '@/utils/constants';
import useModalAction from '@/utils/helpers/back-action';
import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { Flex, Form, Typography } from 'antd';
import useNotification from '@utils/helpers/my-notification.tsx';

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
  const [myNotification] = useNotification();
  const goBack = useModalAction({
    type: 'back',
    danger: true,
  });
  const param = useParams({
    from: '/_auth/po/update/$id',
    select: (params) => ({ id: params.id }),
  });
  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationFn: (value: { [key: string]: string }) => updatePo(value, param.id),
    onSuccess: () => {
      queryClient
        .invalidateQueries({
          queryKey: [QUERY_KEYS.GET_PO, param.id],
        })
        .then();
      myNotification({
        type: 'success',
        description: SUCCESS_MSG.PO.UPDATE_SUCCESS,
      });
    },
    onError: (err: any) => {
      myNotification({
        message: ERROR_MSG.PO.UPDATE_ERROR,
        description: err.message || 'Something went wrong',
      });
    },
  });
  return (
    <>
      <NavigationBack />
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
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            >
              <MyInput placeholder="Enter PO name" maxLength={255} />
            </Form.Item>
            <Form.Item
              label="Email"
              name="user_name"
              rules={[
                {
                  type: 'email',
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
          <Form.Item label="Wallet" name="wallet">
            <MyInput placeholder="Enter PO wallet" />
          </Form.Item>
          <Form.Item
            label="Info"
            name="info"
            rules={[
              {
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
              onClick={() => goBack({ formData: form.getFieldsValue() })}
            >
              Cancel
            </CancelButtonAction>
          </Flex>
        </Form>
      </CenterContentLayout>
    </>
  );
};
