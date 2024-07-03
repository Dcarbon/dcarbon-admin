import NavigationBack from '@/components/common/navigation-back';
import UploadMultiImage from '@/components/common/upload';
import { createLazyFileRoute } from '@tanstack/react-router';
import { Button, Col, Flex, Form, Input, Select } from 'antd';

export const Route = createLazyFileRoute('/_auth/project/create')({
  component: () => <CreateProject />,
});

const CreateProject = () => {
  const [form] = Form.useForm();

  return (
    <div>
      <NavigationBack href="/project" />
      <Form form={form} layout="vertical">
        <Flex>
          <Col span={12}>
            <Form.Item label="Project name" name="project_name">
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input />
            </Form.Item>
            <Form.Item label="Account PO" name="accountPO">
              <Form.Item
                label="email"
                name="accountPO"
                rules={[
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!',
                  },
                ]}
              >
                <Select />
              </Form.Item>
            </Form.Item>
          </Col>
          <Col span={12}>
            Images
            <UploadMultiImage />
          </Col>
        </Flex>
        <Flex justify="end" gap={10}>
          <Button type="primary">Submit</Button>
          <Button danger htmlType="reset">
            Cancel
          </Button>
        </Flex>
      </Form>
    </div>
  );
};
