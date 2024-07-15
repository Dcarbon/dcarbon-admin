import { memo } from 'react';
import { createPo } from '@/adapters/po';
import SubmitButtonAction from '@/components/common/button/button-submit';
import { QUERY_KEYS } from '@/utils/constants';
import useModalAction from '@/utils/helpers/back-action';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Flex, Form, message, notification } from 'antd';
import CancelButtonAction from '@components/common/button/button-cancel.tsx';
import MyInput from '@components/common/input/my-input.tsx';
import MyInputTextArea from '@components/common/input/my-textarea.tsx';
import CenterContentLayout from '@components/common/layout/center-content/center-content.layout.tsx';

export const Route = createFileRoute('/_auth/po/create')({
  component: () => <PoCreate />,
});
const PoCreate = memo(() => {
  const [form] = Form.useForm();
  const goBack = useModalAction({
    type: 'back',
    danger: true,
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const handleCreatePo = useMutation({
    mutationFn: createPo,
    onSuccess: () => {
      message.success('Create po successfully');
      form.resetFields();
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PO],
      });
      navigate({
        to: '/project',
      });
    },
    onError: (error: any) => {
      notification.error({
        message: 'Create po failed',
        description: error.message.toString() || 'Something went wrong',
      });
    },
  });
  return (
    <CenterContentLayout>
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => handleCreatePo.mutate(values)}
        style={{ width: '100%' }}
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
              width: 'calc(50% - 8px)',
              margin: '0 8px',
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
          <MyInputTextArea placeholder="Enter PO info" maxLength={5000} />
        </Form.Item>
        <Flex gap={10} justify="center">
          <SubmitButtonAction loading={handleCreatePo.isPending}>
            Submit
          </SubmitButtonAction>
          <CancelButtonAction
            disabled={handleCreatePo.isPending}
            onClick={goBack}
          >
            Cancel
          </CancelButtonAction>
        </Flex>
      </Form>
    </CenterContentLayout>
  );
});
