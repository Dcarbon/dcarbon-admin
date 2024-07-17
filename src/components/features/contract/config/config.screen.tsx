import { forwardRef, memo } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Card, Col, Form, Row, Space } from 'antd';
import CancelButtonAction from '@components/common/button/button-cancel.tsx';
import SubmitButtonAction from '@components/common/button/button-submit.tsx';
import SkeletonInput from '@components/common/input/skeleton-input.tsx';
import useModalAction from '@utils/helpers/back-action.tsx';

const { Meta } = Card;

interface IProps {
  loading?: boolean;
}

const ConfigScreen = memo(
  forwardRef(({ loading }: IProps) => {
    console.info('ConfigScreen');
    const goBack = useModalAction({
      type: 'back',
      danger: true,
    });
    const [form] = Form.useForm();
    return (
      <>
        <Form
          form={form}
          layout="vertical"
          disabled={loading}
          // onFinish={(values) => handleCreatePo.mutate(values)}
          style={{ width: '100%' }}
        >
          <Form.Item style={{ marginBottom: 0 }}>
            <Form.Item
              label="Mint Fee"
              name="mint_fee"
              rules={[
                {
                  required: true,
                },
              ]}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            >
              <SkeletonInput
                placeholder="Enter PO name"
                width={'100%'}
                stringMode
                isNumber={true}
                loading={loading}
              />
            </Form.Item>
            <Form.Item
              label="Rate"
              name="rate"
              tooltip={{
                title: 'Carbon -> DCarbon conversion ratio',
                icon: <InfoCircleOutlined />,
              }}
              rules={[
                {
                  required: true,
                },
              ]}
              style={{
                display: 'inline-block',
                width: 'calc(50%)',
                margin: '0px 0px 0px 8px',
              }}
            >
              <SkeletonInput
                placeholder="Enter rate"
                stringMode
                width={'100%'}
                isNumber={true}
                loading={loading}
              />
            </Form.Item>
          </Form.Item>
          <Form.Item
            label="Collect Fee Wallet"
            name="collect_fee_wallet"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <SkeletonInput placeholder="Enter wallet" loading={loading} />
          </Form.Item>
          <Row>
            <Col span={12} style={{ paddingRight: '8px' }}>
              <Card
                loading={loading}
                style={{ width: '100%' }}
                cover={
                  !loading && (
                    <img
                      alt="example"
                      src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                  )
                }
              >
                <Meta title="DCarbon" description="33MkUm...iCum" />
              </Card>
            </Col>
            <Col span={12} style={{ paddingLeft: '8px' }}>
              <Card
                style={{ width: '100%' }}
                loading={loading}
                cover={
                  !loading && (
                    <img
                      alt="example"
                      src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                    />
                  )
                }
              >
                <Meta
                  title="Carbon"
                  description={<a href={''}>33MkUmaq1..12iCum</a>}
                />
              </Card>
            </Col>
          </Row>
          <Space className={'space-config'}>
            <SubmitButtonAction loading={loading}>Init</SubmitButtonAction>
            <CancelButtonAction onClick={goBack}>Cancel</CancelButtonAction>
          </Space>
        </Form>
      </>
    );
  }),
);
export default ConfigScreen;
