import {
  forwardRef,
  memo,
  useImperativeHandle,
  useLayoutEffect,
  useState,
} from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Card, Col, Form, Row, Space } from 'antd';
import CancelButtonAction from '@components/common/button/button-cancel.tsx';
import SubmitButtonAction from '@components/common/button/button-submit.tsx';
import CopyToClipBroad from '@components/common/copy';
import SkeletonInput from '@components/common/input/skeleton-input.tsx';
import { IConfig } from '@components/features/contract/config/config.interface.ts';
import useModalAction from '@utils/helpers/back-action.tsx';
import { truncateText } from '@utils/helpers/common.tsx';
import { getExplorerUrl } from '@utils/wallet';

const { Meta } = Card;

interface IProps {
  loading?: boolean;
}

const ConfigScreen = memo(
  forwardRef(({ loading }: IProps, ref) => {
    console.info('ConfigScreen');
    const [config, setConfig] = useState<IConfig>();
    const goBack = useModalAction({
      type: 'back',
      danger: true,
    });
    const [form] = Form.useForm<IConfig>();
    useImperativeHandle(ref, () => ({
      triggerSetConfig(config: IConfig) {
        setConfig(config);
      },
    }));
    useLayoutEffect(() => {
      if (config) {
        form.setFieldsValue({
          rate: config.rate,
          mint_fee: config.mint_fee,
          collect_fee_wallet: config.collect_fee_wallet,
        });
      }
    }, [config]);
    return (
      <>
        <Form
          form={form}
          layout="vertical"
          disabled={loading || !!config?.rate}
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
            {config?.carbon && (
              <Col span={12} style={{ paddingRight: '8px' }}>
                <Card
                  loading={loading}
                  style={{ width: '100%' }}
                  cover={
                    !loading && (
                      <img
                        alt={config?.carbon?.name}
                        src={config?.carbon?.image}
                      />
                    )
                  }
                >
                  <Meta
                    title={`${config?.carbon?.name} (${config.carbon.symbol})`}
                    description={
                      <span className={'contract-token-mint-address'}>
                        <a
                          href={getExplorerUrl(config?.carbon.mint, 'address')}
                          target="_blank"
                        >
                          {truncateText(config?.carbon?.mint)}
                        </a>
                        <CopyToClipBroad
                          text={config?.carbon?.mint}
                          type="icon"
                        />
                      </span>
                    }
                  />
                </Card>
              </Col>
            )}
            {config?.dcarbon && (
              <Col span={12} style={{ paddingLeft: '8px' }}>
                <Card
                  loading={loading}
                  style={{ width: '100%' }}
                  cover={
                    !loading && (
                      <img
                        alt={config?.dcarbon?.name}
                        src={config?.dcarbon?.image}
                      />
                    )
                  }
                >
                  <Meta
                    title={`${config?.dcarbon?.name} (${config.dcarbon.symbol})`}
                    description={
                      <span className={'contract-token-mint-address'}>
                        <a
                          href={getExplorerUrl(config?.dcarbon.mint, 'address')}
                          target="_blank"
                        >
                          {truncateText(config?.dcarbon?.mint)}
                        </a>
                        <CopyToClipBroad
                          text={config?.dcarbon?.mint}
                          type="icon"
                        />
                      </span>
                    }
                  />
                </Card>
              </Col>
            )}
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
