import {
  forwardRef,
  memo,
  useImperativeHandle,
  useLayoutEffect,
  useState,
} from 'react';
import { ERROR_CONTRACT } from '@/constants';
import { InfoCircleOutlined, SwapOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Row, Space } from 'antd';
import CancelButtonAction from '@components/common/button/button-cancel.tsx';
import SubmitButtonAction from '@components/common/button/button-submit.tsx';
import SubmitButton from '@components/common/button/submit-button.tsx';
import CopyToClipBroad from '@components/common/copy';
import SkeletonInput from '@components/common/input/skeleton-input.tsx';
import { IConfig } from '@components/features/contract/config/config.interface.ts';
import useModalAction from '@utils/helpers/back-action.tsx';
import { truncateText } from '@utils/helpers/common.tsx';
import useNotification from '@utils/helpers/my-notification.tsx';
import { getExplorerUrl } from '@utils/wallet';

import './config.css';

const { Meta } = Card;

export interface TConfigUpdate extends IConfig {
  type: 'mint_fee' | 'rate' | 'collect_fee_wallet';
}

interface IProps {
  loading?: boolean;
  triggerUpdateConfig: (config: TConfigUpdate) => void;
}

const ConfigScreen = memo(
  forwardRef(({ loading, triggerUpdateConfig }: IProps, ref) => {
    console.info('ConfigScreen');
    const [myNotification] = useNotification();
    const [config, setConfig] = useState<IConfig>();
    const [isEdit, setEditFlg] = useState<boolean>(false);
    const goBack = useModalAction({
      type: 'back',
      danger: true,
    });
    const [form] = Form.useForm<IConfig>();
    useImperativeHandle(ref, () => ({
      triggerSetConfig(config: IConfig) {
        setEditFlg(false);
        setConfig(config);
      },
    }));
    const handleEdit = (editFlg: boolean) => {
      if (editFlg) {
        form.setFieldsValue({
          rate: config?.rate,
          mint_fee: config?.mint_fee,
          collect_fee_wallet: config?.collect_fee_wallet,
        });
      }
      setEditFlg(!editFlg);
    };
    const updateConfig = (option: TConfigUpdate) => {
      if (option.type === 'mint_fee') {
        if (!option.mint_fee) {
          myNotification(ERROR_CONTRACT.CONTRACT.CONFIG.FEE_EMPTY);
          return;
        }
        if (Number(option.mint_fee) === config?.mint_fee) {
          myNotification(ERROR_CONTRACT.CONTRACT.CONFIG.FEE_EXIST);
          return;
        }
      }
      if (option.type === 'rate') {
        if (!option.rate) {
          myNotification(ERROR_CONTRACT.CONTRACT.CONFIG.RATE_EMPTY);
          return;
        }
        if (Number(option.rate) === config?.rate) {
          myNotification(ERROR_CONTRACT.CONTRACT.CONFIG.RATE_EXIST);
          return;
        }
      }
      if (option.type === 'collect_fee_wallet') {
        if (!option.collect_fee_wallet) {
          myNotification(ERROR_CONTRACT.CONTRACT.CONFIG.WALLET_EMPTY);
          return;
        }
        if (option.collect_fee_wallet === config?.collect_fee_wallet) {
          myNotification(ERROR_CONTRACT.CONTRACT.CONFIG.RATE_EXIST);
          return;
        }
      }
      triggerUpdateConfig(option);
    };
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
            <Row>
              <Col span={12}>
                <Form.Item
                  label="Mint Fee"
                  className={'contract-form-update'}
                  style={{ marginRight: '8px' }}
                >
                  <Form.Item
                    name="mint_fee"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    style={{ flexGrow: 1 }}
                  >
                    <SkeletonInput
                      placeholder="Mint fee"
                      width={'100%'}
                      stringMode
                      isNumber={true}
                      loading={loading}
                      disabled={(loading || !!config?.mint_fee) && !isEdit}
                    />
                  </Form.Item>
                  {isEdit && (
                    <Button
                      type={'primary'}
                      disabled={(loading || !!config?.rate) && !isEdit}
                      icon={<SwapOutlined />}
                      className={'contract-button contract-switch-button'}
                      onClick={() =>
                        updateConfig({
                          type: 'mint_fee',
                          mint_fee: form.getFieldValue('mint_fee'),
                        })
                      }
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Rate"
                  tooltip={{
                    title: 'Carbon -> DCarbon conversion ratio',
                    icon: <InfoCircleOutlined />,
                  }}
                  className={'contract-form-update'}
                  style={{ marginLeft: '8px' }}
                >
                  <Form.Item
                    name="rate"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    style={{ flexGrow: 1 }}
                  >
                    <SkeletonInput
                      placeholder="Rate"
                      width={'100%'}
                      stringMode
                      isNumber={true}
                      loading={loading}
                      disabled={
                        (loading || !!config?.collect_fee_wallet) && !isEdit
                      }
                    />
                  </Form.Item>
                  {isEdit && (
                    <Button
                      type={'primary'}
                      disabled={(loading || !!config?.rate) && !isEdit}
                      icon={<SwapOutlined />}
                      className={'contract-button contract-switch-button'}
                      onClick={() =>
                        updateConfig({
                          type: 'rate',
                          rate: form.getFieldValue('rate'),
                        })
                      }
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            label="Collect Fee Wallet"
            className={'contract-form-update'}
          >
            <Form.Item
              name="collect_fee_wallet"
              rules={[
                {
                  required: true,
                },
              ]}
              style={{ flexGrow: 1 }}
            >
              <SkeletonInput
                placeholder="Enter wallet"
                loading={loading}
                disabled={(loading || !!config?.rate) && !isEdit}
                value={form.getFieldValue('collect_fee_wallet')}
                onChange={(e: any) =>
                  form.setFieldsValue({ collect_fee_wallet: e?.target?.value })
                }
              />
            </Form.Item>
            {isEdit && (
              <Button
                type={'primary'}
                disabled={(loading || !!config?.rate) && !isEdit}
                icon={<SwapOutlined />}
                className={'contract-button contract-switch-button'}
                onClick={() =>
                  updateConfig({
                    type: 'collect_fee_wallet',
                    collect_fee_wallet:
                      form.getFieldValue('collect_fee_wallet'),
                  })
                }
              />
            )}
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
            {!config?.mint_fee ? (
              <SubmitButtonAction disabled={false} loading={loading}>
                Init
              </SubmitButtonAction>
            ) : (
              <SubmitButton disabled={false} onClick={() => handleEdit(isEdit)}>
                {isEdit ? 'Reset' : 'Edit'}
              </SubmitButton>
            )}
            <CancelButtonAction onClick={goBack}>Cancel</CancelButtonAction>
          </Space>
        </Form>
      </>
    );
  }),
);
export default ConfigScreen;
