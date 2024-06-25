import { Button, Flex, Form, Input } from 'antd';

import UploadMultiImage from '../../../common/upload';

const ProjectForm = () => {
  const [form] = Form.useForm();
  return (
    <div>
      ProjectForm
      <Form form={form} layout="vertical">
        <Flex>
          <div style={{ width: '48%', padding: 10 }}>
            <Form.Item label="Name" name="name">
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
                <Input type="email" />
              </Form.Item>
            </Form.Item>
          </div>
          <div>
            Images
            <UploadMultiImage />
          </div>
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

export default ProjectForm;
