import { useState } from 'react';
import CancelButtonAction from '@/components/common/button/button-cancel';
import SubmitButtonAction from '@/components/common/button/button-submit';
import { Button, Card, Flex, Form, InputNumber, Modal, Typography } from 'antd';
import { createStyles } from 'antd-style';

const useStyle = createStyles(() => ({
  'my-modal-mask': {
    boxShadow: `inset 0 0 15px #fff`,
  },
  'my-modal-content': {
    border: '1px solid #333',
  },
}));
const ProjectDashboard = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const { styles } = useStyle();
  const classNames = {
    mask: styles['my-modal-mask'],
    content: styles['my-modal-content'],
  };
  const modalStyles = {
    mask: {
      backdropFilter: 'blur(10px)',
    },
    content: {
      boxShadow: '0 0 30px #999',
      borderRadius: 'var(--div-radius)',
    },
  };
  return (
    <Flex vertical gap={10}>
      <Modal
        title="Listing"
        open={visible}
        onCancel={() => setVisible(false)}
        maskClosable
        width={400}
        footer={null}
        classNames={classNames}
        styles={modalStyles}
        centered
      >
        <Flex gap={10}>
          <Form form={form} className="w-full" layout="vertical">
            <Form.Item name={'volume'} label="Volume">
              <InputNumber
                className="w-full"
                addonAfter={<Button type="link">Max</Button>}
                min={0}
              />
            </Form.Item>
            <Form.Item name={'price'} label="Price">
              <InputNumber
                className="w-full"
                addonAfter={<Button type="link">Max</Button>}
                min={0}
              />
            </Form.Item>
            <Flex justify="flex-end" gap={10}>
              <SubmitButtonAction>Listing</SubmitButtonAction>
              <CancelButtonAction onClick={() => setVisible(false)}>
                Cancel
              </CancelButtonAction>
            </Flex>
          </Form>
        </Flex>
      </Modal>
      <Flex justify="end">
        <Button type="primary" onClick={() => setVisible(true)}>
          Listing
        </Button>
      </Flex>
      <Flex className="project-dashboard" gap={20} wrap>
        <Card hoverable className="project-dashboard-card" title="Crypto">
          <Typography.Title level={2}>~12.9</Typography.Title>
        </Card>
        <Card
          hoverable
          className="project-dashboard-card"
          title="revenue - Cost"
        >
          <Typography.Title level={2}>126$</Typography.Title>
        </Card>
        <Card hoverable className="project-dashboard-card" title="Total Assets">
          <Typography.Title level={2}>90</Typography.Title>
        </Card>
        <Card
          hoverable
          className="project-dashboard-card"
          title="Total Carbon minted"
        >
          <Typography.Title level={2}>45</Typography.Title>
        </Card>
        <Card
          hoverable
          className="project-dashboard-card"
          title="Total Carbon Sold"
        >
          <Typography.Title level={2}>45</Typography.Title>
        </Card>
      </Flex>
    </Flex>
  );
};

export default ProjectDashboard;
