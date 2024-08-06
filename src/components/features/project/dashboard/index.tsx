import { useState } from 'react';
import { getDashBoardProject } from '@/adapters/project';
import CancelButtonAction from '@/components/common/button/button-cancel';
import SubmitButtonAction from '@/components/common/button/button-submit';
import { QUERY_KEYS } from '@/utils/constants';
import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { Button, Empty, Flex, Form, InputNumber, Modal, Row } from 'antd';
import { createStyles } from 'antd-style';

import AnalyticsCard from '../analytics-card';
import TotalOutputCard from '../total-output-card';

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
  const param = useParams({
    from: '/_auth/project/$slug',
    select: (params) => ({ id: params.slug }),
  });
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
  const { data } = useQuery({
    queryKey: [QUERY_KEYS.GET_PROJECT_DASHBOARD, param.id],
    queryFn: () => getDashBoardProject(param.id),
  });
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
      {data ? (
        <>
          <Row gutter={[16, 16]} className="project-dashboard">
            <TotalOutputCard
              data={data.carbon_credit.minted}
              title="Total carbon minted"
              img="/image/dashboard/total-minted.svg"
            />
            <TotalOutputCard
              data={data.carbon_credit.sold}
              title="Totalcarbon sold"
              img="/image/dashboard/total-carbon-sold.svg"
            />
          </Row>
          <Row gutter={[16, 16]} className="project-dashboard">
            <AnalyticsCard
              data={data.aggregation.cost.amount}
              currency={data.aggregation.cost.currency}
              title="Total cost"
              img="/image/dashboard/total-cost.webp"
            />
            <AnalyticsCard
              data={data.aggregation.assets_total}
              title="Total assets available"
              img="/image/dashboard/total-assets.webp"
            />
            <AnalyticsCard
              data={data.aggregation.crypto}
              title="Total crypto available"
              img="/image/dashboard/crypto.webp"
            />
          </Row>
        </>
      ) : (
        <Empty />
      )}
    </Flex>
  );
};

export default ProjectDashboard;
