import {
  forwardRef,
  memo,
  useImperativeHandle,
  useLayoutEffect,
  useState,
} from 'react';
import { ERROR_CONTRACT } from '@/constants';
import {
  InfoCircleOutlined,
  SaveOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Col, Flex, Form, Row, Space } from 'antd';
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

import { TIotDeviceType } from '@/types/device';
import { IConfigTokenResponse } from '@/types/projects';

export interface TConfigUpdate extends IConfig {
  type:
    | 'mint_fee'
    | 'rate'
    | 'collect_fee_wallet'
    | 'device_limit'
    | 'signer_wallet';
}

interface IProps {
  loading?: boolean;
  configLoading?: boolean;
  deviceTypes?: TIotDeviceType[];
  triggerUpdateConfig: (config: TConfigUpdate) => void;
  configData?: IConfigTokenResponse;
}

const ConfigScreen = memo(
  forwardRef(
    (
      {
        loading,
        configLoading,
        triggerUpdateConfig,
        deviceTypes,
        configData,
      }: IProps,
      ref,
    ) => {
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
          const deviceValue: any = {};
          deviceTypes?.forEach((device) => {
            const match = config?.device_limit?.find(
              (info) => info.device_type == device.id,
            );
            deviceValue[`type_${device.id}_limit`] = match ? match.limit : null;
          });
          form.setFieldsValue({
            rate: config?.rate,
            mint_fee: config?.mint_fee,
            collect_fee_wallet: config?.collect_fee_wallet,
            ...deviceValue,
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
        if (option.type === 'device_limit') {
          if (!option.type_limit) {
            myNotification(ERROR_CONTRACT.CONTRACT.CONFIG.LIMIT_EMPTY);
            return;
          }
        }
        triggerUpdateConfig(option);
      };
      useLayoutEffect(() => {
        if (config) {
          const deviceValue: any = {};
          config.device_limit?.forEach((device) => {
            deviceValue[`type_${device.device_type}_limit`] = device.limit;
          });
          form.setFieldsValue({
            rate: config.rate,
            mint_fee: config.mint_fee,
            collect_fee_wallet: config.collect_fee_wallet,
            signer_wallet: configData?.signer,
            ...deviceValue,
          });
        }
      }, [config, deviceTypes, configData]);
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
                        isnumber={true}
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
                        isnumber={true}
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
                  onChange={(e: any) =>
                    form.setFieldsValue({
                      collect_fee_wallet: e?.target?.value,
                    })
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
            <Form.Item label="Signer Wallet" className={'contract-form-update'}>
              <Form.Item
                name="signer_wallet"
                rules={[
                  {
                    required: true,
                  },
                ]}
                style={{ flexGrow: 1 }}
              >
                <SkeletonInput
                  placeholder="Enter wallet"
                  loading={configLoading}
                  disabled={
                    (loading || configLoading || !!config?.rate) && !isEdit
                  }
                  onChange={(e: any) =>
                    form.setFieldsValue({ signer_wallet: e?.target?.value })
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
                      type: 'signer_wallet',
                      signer_wallet: form.getFieldValue('signer_wallet'),
                    })
                  }
                />
              )}
            </Form.Item>
            <Row>
              {configData?.carbon && (
                <Col span={12} style={{ paddingRight: '8px' }}>
                  <Flex vertical={false}>
                    <Avatar
                      shape="square"
                      size={70}
                      src={configData?.carbon?.image}
                    />
                    <Flex vertical style={{ padding: '0px 8px' }}>
                      <span>
                        {`${configData?.carbon?.name} (${configData.carbon.symbol})`}
                      </span>
                      <span className={'contract-token-mint-address'}>
                        <a
                          href={getExplorerUrl(
                            configData?.carbon.mint,
                            'address',
                          )}
                          target="_blank"
                        >
                          {truncateText(configData?.carbon?.mint)}
                        </a>
                        <CopyToClipBroad
                          text={configData?.carbon?.mint}
                          type="icon"
                        />
                      </span>
                    </Flex>
                  </Flex>
                </Col>
              )}
              {configData?.dcarbon && (
                <Col span={12} style={{ paddingLeft: '8px' }}>
                  <Flex vertical={false}>
                    <Avatar
                      shape="square"
                      size={70}
                      src={configData?.dcarbon?.image}
                    />
                    <Flex vertical style={{ padding: '0px 8px' }}>
                      <span>
                        {`${configData?.dcarbon?.name} (${configData.dcarbon.symbol})`}
                      </span>
                      <span className={'contract-token-mint-address'}>
                        <a
                          href={getExplorerUrl(
                            configData?.dcarbon.mint,
                            'address',
                          )}
                          target="_blank"
                        >
                          {truncateText(configData?.dcarbon?.mint)}
                        </a>
                        <CopyToClipBroad
                          text={configData?.dcarbon?.mint}
                          type="icon"
                        />
                      </span>
                    </Flex>
                  </Flex>
                </Col>
              )}
            </Row>
            <Row style={{ marginTop: '15px' }}>
              {deviceTypes?.map((device) => {
                const isHaveSetting = !!form.getFieldValue(
                  `type_${device.id}_limit`,
                );
                return (
                  <Col span={8} key={device.id}>
                    <Form.Item
                      label={`${device.id}-${device.name} limit`}
                      style={{ width: '100%', paddingRight: '8px' }}
                      className={'contract-form-update'}
                    >
                      <Form.Item
                        name={`type_${device.id}_limit`}
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                        style={{ flexGrow: 1 }}
                      >
                        <SkeletonInput
                          isnumber={true}
                          placeholder={`${device.name} limit`}
                          style={{ width: '100%' }}
                          loading={loading}
                          disabled={(loading || !!config?.rate) && !isEdit}
                        />
                      </Form.Item>
                      {isEdit && (
                        <Button
                          type={'primary'}
                          disabled={(loading || !!config?.rate) && !isEdit}
                          icon={
                            isHaveSetting ? <SwapOutlined /> : <SaveOutlined />
                          }
                          className={`contract-button ${isHaveSetting ? 'contract-switch-button' : ''}`}
                          onClick={() =>
                            updateConfig({
                              type: 'device_limit',
                              type_limit: form.getFieldValue(
                                `type_${device.id}_limit`,
                              ),
                              d_type: device.id,
                            })
                          }
                        />
                      )}
                    </Form.Item>
                  </Col>
                );
              })}
            </Row>
            <Space className={'space-config'}>
              {!config?.mint_fee ? (
                <SubmitButtonAction disabled={false} loading={loading}>
                  Init
                </SubmitButtonAction>
              ) : (
                <SubmitButton
                  disabled={false}
                  onClick={() => handleEdit(isEdit)}
                >
                  {isEdit ? 'Reset' : 'Edit'}
                </SubmitButton>
              )}
              <CancelButtonAction onClick={goBack}>Cancel</CancelButtonAction>
            </Space>
          </Form>
        </>
      );
    },
  ),
);
export default ConfigScreen;
