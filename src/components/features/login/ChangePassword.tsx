import React from 'react';
import { Button, Flex, Form, Input, Modal, Typography } from 'antd';

const ChangePassword = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = React.useState(true);
  return (
    <Modal
      open={open}
      maskClosable={false}
      centered
      onCancel={() => setOpen(false)}
      width={300}
      footer={null}
      closeIcon={null}
    >
      <Form form={form} layout="vertical">
        <Typography.Title level={3}>Change password</Typography.Title>
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            {
              required: true,
              message: 'Please input your new password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('The two passwords that you entered do not match!'),
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Flex justify="end">
          <Button type="primary" htmlType="submit" style={{ margin: '8px 0' }}>
            Change Password
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

export default ChangePassword;
