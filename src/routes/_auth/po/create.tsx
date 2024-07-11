import { createPo } from '@/adapters/po';
import ButtonCancel from '@/components/common/button/button-cancel';
import ButtonSubmit from '@/components/common/button/button-submit';
import NavigationBack from '@/components/common/navigation-back';
import { QUERY_KEYS } from '@/utils/constants';
import useBackAction from '@/utils/helpers/back-action';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Col, Flex, Form, Input, message, notification } from 'antd';

export const Route = createFileRoute('/_auth/po/create')({
  component: () => <PoCreate />,
});
const PoCreate = () => {
  const [form] = Form.useForm();
  const goBack = useBackAction();
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
    <Col span={12}>
      <NavigationBack href="/po" />
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => handleCreatePo.mutate(values)}
      >
        <Form.Item
          label="Name"
          name="profile_name"
          rules={[
            {
              required: true,
              max: 255,
            },
          ]}
        >
          <Input placeholder="Enter PO name" maxLength={255} />
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
        >
          <Input placeholder="Enter PO email" />
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
          <Input placeholder="Enter PO wallet" />
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
          <Input.TextArea placeholder="Enter PO info" maxLength={5000} />
        </Form.Item>
        <Flex gap={10} justify="end">
          <ButtonSubmit loading={handleCreatePo.isPending}>Submit</ButtonSubmit>
          <ButtonCancel disabled={handleCreatePo.isPending} onClick={goBack}>
            Cancel
          </ButtonCancel>
        </Flex>
      </Form>
    </Col>
  );
};
